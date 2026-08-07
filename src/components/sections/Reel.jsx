import React, { useEffect, useRef, useState } from 'react'
import { reels } from '../../constants'

// Showreel – 4 klipy, natywne wideo bez WebGL: materiał jest treścią, nie tłem.
// Desktop: najechanie = cichy podgląd, klik = odtwarzanie z dźwiękiem.
// Mobile: tap = odtwarzanie z dźwiękiem, drugi tap = pauza.
// preload="none" + poster – klipy nie kosztują transferu, dopóki ktoś ich nie dotknie.

const ReelTile = ({ reel, activeId, setActiveId }) => {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const active = activeId === reel.id

  // gdy dźwięk przejmuje inny kafelek – ten cichnie i staje
  useEffect(() => {
    const video = videoRef.current
    if (!video || active) return
    video.muted = true
    if (!video.paused) video.pause()
  }, [active])

  const onClick = () => {
    const video = videoRef.current
    if (!video) return
    if (active) {
      video.pause()
      video.muted = true
      setActiveId(null)
    } else {
      video.muted = false
      video.play().catch(() => {})
      setActiveId(reel.id)
    }
  }

  const onEnter = () => {
    const video = videoRef.current
    if (!video || active) return
    video.muted = true
    video.play().catch(() => {})
  }

  const onLeave = () => {
    const video = videoRef.current
    if (!video || active) return
    video.pause()
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`${reel.label} – ${active ? 'zatrzymaj' : 'odtwórz z dźwiękiem'}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-black text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        poster={reel.poster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      >
        <source src={reel.webm} type="video/webm" />
        <source src={reel.mp4} type="video/mp4" />
      </video>

      {/* etykieta klipu */}
      <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[0.6rem] font-light uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm md:left-4 md:top-4">
        {reel.label}
      </span>

      {/* ikona play, dopóki klip stoi */}
      {!playing && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M1.5 1.8v14.4L14.5 9 1.5 1.8Z" fill="#fff" fillOpacity="0.9" />
            </svg>
          </span>
        </span>
      )}

      {/* status dźwięku */}
      <span
        className={`absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3 py-1.5 text-[0.6rem] font-light uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm transition-opacity duration-300 md:bottom-4 md:right-4 ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-red-500' : 'bg-white/40'}`} />
        {active ? 'Dźwięk wł.' : 'Dźwięk wył.'}
      </span>
    </button>
  )
}

const Reel = () => {
  const [activeId, setActiveId] = useState(null)

  return (
    <section id="showreel" className="relative z-20 bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-[120rem] px-6 pb-[10vh] md:px-12 md:pb-[14vh] xl:px-16">
        <div className="title flex flex-col gap-4 pb-8 md:pb-12">
          <div className="flex w-full justify-between font-light text-sm md:justify-start md:space-x-4 md:text-xl xl:text-2xl">
            <div aria-hidden="true">✦</div>
            <div className="uppercase">Showreel</div>
          </div>

          <div className="flex w-full max-w-3xl flex-col uppercase md:w-fit">
            <h2 className="text-4xl md:text-6xl lg:text-7xl">Zobacz to w ruchu</h2>
            <div className="w-full text-sm md:text-base lg:text-xl">
              <p className="text-justify after:inline-block after:w-full md:text-right">
                kliknij, żeby usłyszeć
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {reels.map((reel) => (
            <ReelTile key={reel.id} reel={reel} activeId={activeId} setActiveId={setActiveId} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reel
