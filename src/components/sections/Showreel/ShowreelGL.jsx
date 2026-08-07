import React, { useEffect, useRef, useState } from 'react'
import { SHOWREEL_VERTEX, SHOWREEL_FRAGMENT } from './showreelShaders'

// Silnik WebGL sekcji Showreel. Zasady twarde:
// - dokładnie JEDEN element <video> i jeden upload klatki per frame (gated rVFC),
// - pętla rAF żyje tylko gdy sekcja w viewporcie I jest co robić (inaczej śpi),
// - bez loseContext w cleanupie (StrictMode/HMR – patrz FooterAurora),
// - webglcontextlost / wolne GPU (watchdog kroczący, okna po 90 uploadów) =>
//   degradacja do ShowreelFallback,
// - play() ponawiane w geście użytkownika (klik = setMuted) – autoplay bywa
//   blokowany; odrzucone audible-play wraca do muted i informuje Reacta.

const SCAN_MS = 1200
const SCAN_DELAY_MS = 200 // skan ma być zobaczony, nie minięty w przelocie
const MIX_MS = 500
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

class ShowreelScene {
  constructor(canvas, clips, { onDegrade, onScanState, onReady, onAutoMuted } = {}) {
    this.canvas = canvas
    this.clips = clips
    this.onDegrade = onDegrade
    this.onScanState = onScanState || (() => {})
    this.onReady = onReady || (() => {})
    this.onAutoMuted = onAutoMuted || (() => {})
    this.index = -1
    this.dead = false
    this.visible = false
    this.started = false
    this.pendingScan = false
    this.readySent = false
    this.scanStart = 0
    this.scanY = 1.2 // przed pierwszym skanem: cały kadr w trybie "mapy"
    this.mixStart = 0
    this.videoMix = 0
    this.hasNewFrame = false
    this.videoHasFrames = false
    this.posters = new Map()
    this.frameTimes = []
    this.raf = 0
    this.rafArmed = false
    this.startTimer = 0
  }

  degrade() {
    const cb = this.onDegrade
    this.destroy()
    cb?.()
  }

  init() {
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
    })
    if (!gl || gl.isContextLost()) return false
    this.gl = gl

    // utrata kontekstu w trakcie życia (reset sterownika GPU) => fallback
    this.onCtxLost = (e) => {
      e.preventDefault()
      this.degrade()
    }
    this.canvas.addEventListener('webglcontextlost', this.onCtxLost)

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Showreel shader:', gl.getShaderInfoLog(s))
        return null
      }
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, SHOWREEL_VERTEX)
    const fs = compile(gl.FRAGMENT_SHADER, SHOWREEL_FRAGMENT)
    if (!vs || !fs) return false
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    this.u = {}
    for (const name of ['uRes', 'uScanY', 'uVideoMix', 'uCoverFrom', 'uCoverPoster', 'uCoverVideo']) {
      this.u[name] = gl.getUniformLocation(prog, name)
    }
    gl.uniform1i(gl.getUniformLocation(prog, 'uTexFrom'), 0)
    gl.uniform1i(gl.getUniformLocation(prog, 'uTexPoster'), 1)
    gl.uniform1i(gl.getUniformLocation(prog, 'uTexVideo'), 2)

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    this.tex = {
      from: this.makeTexture(0),
      poster: this.makeTexture(1),
      video: this.makeTexture(2),
    }
    this.cover = { from: [1, 1, 0, 0], poster: [1, 1, 0, 0], video: [1, 1, 0, 0] }

    // jeden element <video> na całą sekcję; sonda kodeków zgodna z plikami (VP8+Opus)
    const video = document.createElement('video')
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'
    this.video = video
    this.srcKey = video.canPlayType('video/webm; codecs="vp8, opus"') ? 'webm' : 'mp4'

    this.armFrameCallback()

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(this.canvas)
    this.resize()

    this.io = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting
        if (entry.isIntersecting) {
          // pierwszy skan mniej więcej gdy kadr sięga środka viewportu
          if (!this.started && entry.intersectionRatio >= 0.45) this.start()
          else if (this.started) {
            this.tryPlay()
            if (this.pendingScan) {
              this.pendingScan = false
              this.beginScan()
            }
          }
          this.wake()
        } else {
          this.video.pause()
          cancelAnimationFrame(this.raf)
          this.rafArmed = false
        }
      },
      { threshold: [0, 0.45] }
    )
    this.io.observe(this.canvas)

    this.preloadPosters()
    // pierwsza klatka od razu – nieodmalowany canvas (alpha:false) komponuje się
    // jako biały prostokąt (lekcja z FooterAurora)
    this.draw()
    return true
  }

  makeTexture(unit) {
    const gl = this.gl
    const t = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    // placeholder 1px, żeby sampler nigdy nie był pusty
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 10, 10, 255]))
    return t
  }

  preloadPosters() {
    this.clips.forEach((clip, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (this.dead) return // scena StrictMode mogła już umrzeć – wspólny kontekst GL
        this.posters.set(i, img)
        if (i === this.index) {
          this.uploadPoster(img)
          // przed pierwszym skanem "mapa" liczy się z tego samego kadru
          if (!this.started) this.uploadInto('from', 0, img, img.naturalWidth, img.naturalHeight)
        }
      }
      img.src = clip.poster
    })
  }

  coverFor(srcW, srcH) {
    const ca = this.canvas.width / Math.max(1, this.canvas.height)
    const ta = srcW / Math.max(1, srcH)
    return ca > ta ? [1, ta / ca, 0, 0] : [ca / ta, 1, 0, 0]
  }

  uploadInto(slot, unit, source, w, h) {
    if (this.dead) return
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, this.tex[slot])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    this.cover[slot] = this.coverFor(w, h)
  }

  uploadPoster(img) {
    this.uploadInto('poster', 1, img, img.naturalWidth, img.naturalHeight)
    this.dirty = true
    if (!this.readySent) {
      this.readySent = true
      this.onReady() // canvas może się wpuścić (fade-in) – ma już sensowny kadr
    }
    if (this.visible) this.wake()
    else this.draw()
  }

  armFrameCallback() {
    const video = this.video
    if (typeof video.requestVideoFrameCallback === 'function') {
      const onFrame = () => {
        if (this.dead) return
        this.hasNewFrame = true
        this.videoHasFrames = true
        this.wake()
        video.requestVideoFrameCallback(onFrame)
      }
      video.requestVideoFrameCallback(onFrame)
    } else {
      // fallback: throttling czasowy w pętli render
      this.rvfcFallback = true
      this.lastVideoUpload = 0
    }
  }

  setSrc(clip) {
    this.videoHasFrames = false
    this.videoMix = 0
    this.mixStart = 0
    this.video.src = clip[this.srcKey] || clip.mp4
    this.video.load()
    // klipy potrafią zaczynać się od ciemnych klatek – przeskocz do dobrego kadru
    if (clip.start) {
      const video = this.video
      const seek = () => {
        try {
          video.currentTime = clip.start
        } catch {
          // seek przed buforem – nieistotne
        }
      }
      if (video.readyState >= 1) seek()
      else video.addEventListener('loadedmetadata', seek, { once: true })
    }
  }

  // play() bywa odrzucany (polityki autoplay); odrzucone audible-play wraca
  // do muted i syncuje UI przez onAutoMuted
  tryPlay() {
    this.video.play().catch(() => {
      if (!this.video.muted) {
        this.video.muted = true
        this.onAutoMuted()
        this.video.play().catch(() => {})
      }
    })
  }

  /* pierwszy skan – po wejściu sekcji w kadr */
  start() {
    if (this.started || this.index < 0) return
    this.started = true
    this.tryPlay()
    this.startTimer = setTimeout(() => {
      if (!this.dead) this.beginScan()
    }, SCAN_DELAY_MS)
  }

  setClip(index) {
    if (index === this.index || this.dead) return
    const first = this.index < 0
    const prevIndex = this.index
    this.index = index

    if (first) {
      const img = this.posters.get(index)
      if (img) {
        this.uploadPoster(img)
        this.uploadInto('from', 0, img, img.naturalWidth, img.naturalHeight)
      }
      this.setSrc(this.clips[index])
      return
    }

    // zamrożenie wychodzącego klipu: ostatnia klatka wideo albo jego poster
    if (this.videoHasFrames && this.video.readyState >= 2) {
      this.uploadInto('from', 0, this.video, this.video.videoWidth, this.video.videoHeight)
    } else {
      const prev = this.posters.get(prevIndex)
      if (prev) this.uploadInto('from', 0, prev, prev.naturalWidth, prev.naturalHeight)
    }

    const img = this.posters.get(index)
    if (img) this.uploadPoster(img)
    this.setSrc(this.clips[index])

    if (this.visible) {
      this.tryPlay()
      this.beginScan()
    } else {
      // poza viewportem: bez play() (bramka IO) i bez połykania animacji –
      // skan odpali się przy powrocie w kadr
      this.pendingScan = true
    }
  }

  beginScan() {
    this.scanStart = performance.now()
    this.onScanState(true)
    this.wake()
  }

  setMuted(muted) {
    this.video.muted = muted
    // wywoływane z gestu użytkownika (klik w kadr) – jedyne pewne okno,
    // w którym play() przejdzie także przy zablokowanym autoplay
    if (this.started && this.video.paused && this.visible) this.video.play().catch(() => {})
  }

  resize() {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    const w = Math.min(1920, Math.max(1, Math.floor(this.canvas.clientWidth * dpr)))
    const h = Math.max(1, Math.floor(this.canvas.clientHeight * dpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
      this.gl.viewport(0, 0, w, h)
      this.cover.from = this.coverFor(...this.sizeOf('from'))
      this.cover.poster = this.coverFor(...this.sizeOf('poster'))
      this.cover.video = this.coverFor(...this.sizeOf('video'))
      this.dirty = true
      if (this.visible) this.wake()
      else this.draw()
    }
  }

  sizeOf(slot) {
    if (slot === 'video' && this.video && this.video.videoWidth) return [this.video.videoWidth, this.video.videoHeight]
    const img = this.posters.get(this.index)
    return img ? [img.naturalWidth, img.naturalHeight] : [16, 9]
  }

  // pętla budzona zdarzeniami (rVFC / skan / poster / resize / IO); śpi, gdy
  // wideo stoi i nie ma nic do narysowania
  wake() {
    if (this.dead || !this.visible || this.rafArmed) return
    this.rafArmed = true
    this.raf = requestAnimationFrame(this.frame)
  }

  frame = () => {
    this.rafArmed = false
    if (this.dead || !this.visible) return

    const now = performance.now()
    if (this.scanStart) {
      const t = Math.min(1, (now - this.scanStart) / SCAN_MS)
      this.scanY = 1.05 - easeInOutCubic(t) * 1.25 // 1.05 -> -0.2
      if (t >= 1) {
        this.scanStart = 0
        this.onScanState(false)
      }
      this.dirty = true
    }

    // fallback rVFC: upload co ~33 ms, jeśli wideo gra
    if (this.rvfcFallback && this.video.readyState >= 2 && !this.video.paused && now - this.lastVideoUpload > 33) {
      this.hasNewFrame = true
      this.videoHasFrames = true
      this.lastVideoUpload = now
    }

    if (this.mixStart) {
      this.videoMix = Math.min(1, (now - this.mixStart) / MIX_MS)
      if (this.videoMix >= 1) this.mixStart = 0
      this.dirty = true
    }

    if (this.hasNewFrame || this.dirty) {
      const t0 = performance.now()
      if (this.hasNewFrame && this.video.readyState >= 2) {
        this.uploadInto('video', 2, this.video, this.video.videoWidth, this.video.videoHeight)
        if (!this.mixStart && this.videoMix < 1) this.mixStart = now
        this.hasNewFrame = false
        this.watch(performance.now() - t0)
        if (this.dead) return // watchdog mógł zdegradować scenę
      }
      this.draw()
      this.dirty = false
    }

    const busy =
      this.scanStart || this.mixStart || this.hasNewFrame || this.dirty || !this.video.paused
    if (busy) {
      this.rafArmed = true
      this.raf = requestAnimationFrame(this.frame)
    }
  }

  // watchdog kroczący: średnia z kolejnych okien po 90 uploadów
  watch(uploadMs) {
    this.frameTimes.push(uploadMs)
    if (this.frameTimes.length >= 90) {
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
      this.frameTimes.length = 0
      if (avg > 8) this.degrade()
    }
  }

  draw() {
    if (this.dead) return
    const gl = this.gl
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height)
    gl.uniform1f(this.u.uScanY, this.scanY)
    gl.uniform1f(this.u.uVideoMix, this.videoMix)
    gl.uniform4fv(this.u.uCoverFrom, this.cover.from)
    gl.uniform4fv(this.u.uCoverPoster, this.cover.poster)
    gl.uniform4fv(this.u.uCoverVideo, this.cover.video)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  destroy() {
    this.dead = true
    clearTimeout(this.startTimer)
    cancelAnimationFrame(this.raf)
    this.rafArmed = false
    this.io?.disconnect()
    this.ro?.disconnect()
    this.canvas.removeEventListener('webglcontextlost', this.onCtxLost)
    if (this.video) {
      this.video.pause()
      this.video.removeAttribute('src')
      this.video.load()
    }
    // celowo BEZ loseContext – getContext na tym samym canvasie zwraca ten sam
    // kontekst, a po utracie drugi mount (StrictMode/HMR) zostałby z białym canvasem
  }
}

export default function ShowreelGL({ clips, activeIndex, muted, onDegrade, onScanState, onAutoMuted }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const degradeRef = useRef(null)
  const scanStateRef = useRef(null)
  const autoMutedRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    degradeRef.current = onDegrade
    scanStateRef.current = onScanState
    autoMutedRef.current = onAutoMuted
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scene = new ShowreelScene(canvas, clips, {
      onDegrade: () => degradeRef.current?.(),
      onScanState: (s) => scanStateRef.current?.(s),
      onAutoMuted: () => autoMutedRef.current?.(),
      onReady: () => setReady(true),
    })
    if (!scene.init()) {
      degradeRef.current?.()
      return
    }
    sceneRef.current = scene
    scene.setClip(activeIndex)
    return () => {
      scene.destroy()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    sceneRef.current?.setClip(activeIndex)
  }, [activeIndex])

  useEffect(() => {
    sceneRef.current?.setMuted(muted)
  }, [muted])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full transition-[opacity,transform] duration-700 group-hover:scale-[1.03] ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}
