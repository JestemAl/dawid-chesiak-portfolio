import React, { useEffect, useRef } from 'react'

// Subtelne, dryfujące "nocne chmury" w tle stopki – czysty WebGL, zero zależności.
// Renderuje w obniżonej rozdzielczości i tylko wtedy, gdy stopka jest w viewporcie.
// Przy prefers-reduced-motion lub braku WebGL nie startuje wcale – wtedy spod
// przezroczystego canvasa widać statyczny gradient CSS ustawiony w stopce.

const VERTEX_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAGMENT_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.0 + vec2(13.7, 7.3);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * (uRes.x / uRes.y), uv.y);
  float t = uTime * 0.03;

  float n = fbm(p * 1.6 + vec2(t, -t * 0.35));
  n += 0.5 * fbm(p * 3.2 - vec2(t * 0.6, t * 0.2));
  n *= 0.62;

  vec3 base = vec3(0.039);               /* #0a0a0a – tło stopki */
  vec3 steel = vec3(0.16, 0.23, 0.33);   /* stalowy błękit – echo nieba z hero */
  vec3 ember = vec3(0.55, 0.10, 0.10);   /* czerwień podpisu */

  float horizon = smoothstep(0.85, 0.1, uv.y);
  vec3 col = base + steel * n * horizon * 0.55;

  float glow = smoothstep(0.9, 0.0, length(uv - vec2(0.16, 0.1)));
  col += ember * glow * n * 0.5;

  /* winieta – krawędzie wtapiają się w tło, bez szwu z galerią powyżej */
  float vig = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.72, uv.y);
  col = mix(base, col, vig);

  /* dither przeciw banding na ciemnych gradientach */
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function FooterAurora({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl || gl.isContextLost()) return

    const compile = (type, src) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('FooterAurora shader:', gl.getShaderInfoLog(shader))
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC)
    if (!vs || !fs) return

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')

    // shader jest miękki, więc niska rozdzielczość jest niewidoczna, a GPU odpoczywa
    const MAX_DIM = 900
    const resize = () => {
      const scale = Math.min(0.5, MAX_DIM / Math.max(1, canvas.clientWidth, canvas.clientHeight))
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale))
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    let raf = 0
    let running = false
    let skip = false
    const start = performance.now()

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      skip = !skip
      if (skip) return // ~30 fps w zupełności wystarcza wolnym chmurom
      draw()
    }

    // pierwsza klatka od razu – nieodmalowany canvas (alpha:false) komponuje się
    // jako biały prostokąt i zakrywałby stopkę do czasu wejścia w viewport
    draw()

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          frame()
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '120px' }
    )
    io.observe(canvas)

    // Uwaga: bez loseContext() w cleanupie – getContext() na tym samym <canvas>
    // zwraca zawsze ten sam kontekst, więc po utracie drugi mount efektu
    // (StrictMode/HMR) zostałby z martwym GL i białym canvasem.
    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
