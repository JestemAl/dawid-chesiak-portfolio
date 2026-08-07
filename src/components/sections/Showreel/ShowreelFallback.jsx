import React, { useEffect, useRef, useState } from 'react'

// Fallback bez WebGL (dotyk / reduced-motion / brak lub słabe GL):
// natywne wideo z posterem, namiastka skanu = poster grayscale -> kolor
// + jednorazowy przelot czerwonej linii (transform-only). Wideo startuje
// wyłącznie po tapnięciu – z dźwiękiem; drugi tap pauzuje.

const ShowreelFallback = ({ clip, focusRing }) => {
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const [reduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [revealed, setRevealed] = useState(reduced)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = frameRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.45 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  // remount po key (zmiana klipu) odłącza <video> od DOM, a odłączony element
  // potrafi dalej grać dźwięk – cleanup pauzuje go jawnie
  useEffect(() => {
    const video = videoRef.current
    return () => video?.pause()
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.muted = false
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  return (
    <button
      ref={frameRef}
      type="button"
      onClick={toggle}
      aria-label={`${clip.label} – ${playing ? 'zatrzymaj' : 'odtwórz z dźwiękiem'}`}
      className={`group relative block aspect-video w-full cursor-pointer overflow-hidden bg-black text-left ${focusRing}`}
    >
      {/* zmiana klipu = remount wideo (key) – stan odtwarzania czyści się sam */}
      <video
        key={clip.id}
        ref={videoRef}
        loop
        playsInline
        preload="none"
        poster={clip.poster}
        onLoadedMetadata={(e) => {
          // różne sloty = różne fragmenty tej samej rolki
          try {
            e.currentTarget.currentTime = clip.start || 0
          } catch {
            // seek przed buforem – nieistotne
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`h-full w-full object-cover transition-[filter] duration-700 ${
          revealed ? '' : '[filter:grayscale(1)_brightness(0.6)]'
        }`}
      >
        <source src={clip.webm} type="video/webm" />
        <source src={clip.mp4} type="video/mp4" />
      </video>

      {/* jednorazowy przelot linii skanu przy odsłonięciu */}
      {revealed && !reduced && (
        <span aria-hidden="true" className="showreel-sweep pointer-events-none absolute inset-x-0 top-0 h-full">
          <span className="absolute bottom-0 left-0 right-0 h-px bg-red-600 shadow-[0_0_24px_rgba(220,38,38,0.45)]" />
        </span>
      )}

      {/* ikona play, dopóki klip stoi */}
      {!playing && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M1.5 1.8v14.4L14.5 9 1.5 1.8Z" fill="#fff" fillOpacity="0.9" />
            </svg>
          </span>
        </span>
      )}

      {/* status dźwięku podczas odtwarzania */}
      {playing && (
        <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3 py-1.5 text-[0.6rem] font-light uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm md:bottom-4 md:right-4">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Dźwięk wł.
        </span>
      )}
    </button>
  )
}

export default ShowreelFallback
