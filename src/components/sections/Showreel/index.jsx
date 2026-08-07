import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { reels } from '../../../constants'
import ShowreelFallback from './ShowreelFallback'

const ShowreelGL = lazy(() => import('./ShowreelGL'))

// Sekcja Showreel („NALOT" – terrain-scan reveal).
// Twarda bramka WebGL: precyzyjny wskaźnik + zero dotyku + brak reduced-motion
// + żywy kontekst GL; każdy inny przypadek dostaje ShowreelFallback.
// Sloty mogą dzielić plik – różne `start` pokazują różne fragmenty rolki,
// więc wszystkie 4 klipy są klikalne od dziś (podmiana plików w constants).

const uniqueClips = reels

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950'

const Showreel = () => {
  const sectionRef = useRef(null)
  const [mode, setMode] = useState(null) // null -> 'gl' | 'fallback'
  const [near, setNear] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [scanTick, setScanTick] = useState(0)

  // bramka WebGL + dynamic import silnika, gdy sekcja zbliża się do viewportu
  // (600px zapasu: kompilacja shaderów i dekoder wideo rozgrzewają się poza
  // ekranem, zanim użytkownik doscrolluje – zero przycięcia przy wejściu)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        let glOk = false
        try {
          glOk = !!document.createElement('canvas').getContext('webgl')
        } catch {
          // brak WebGL -> fallback
        }
        const fine = window.matchMedia('(pointer: fine)').matches && navigator.maxTouchPoints === 0
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setMode(glOk && fine && !reduced ? 'gl' : 'fallback')
        setNear(true)
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const clip = uniqueClips[activeIndex]

  return (
    <section id="showreel" ref={sectionRef} className="relative z-20 bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-[120rem] px-6 pb-[10vh] pt-16 md:px-12 md:pb-[14vh] md:pt-0 xl:px-16">
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

        {/* Kadr 16:9 – licuje się z panelami treści (max-w-[80rem]) */}
        <div className="group relative mx-auto w-full max-w-[80rem]">
          {mode === 'fallback' ? (
            <ShowreelFallback key={clip.id} clip={clip} focusRing={FOCUS_RING} />
          ) : (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
              aria-label={muted ? `${clip.label} – włącz dźwięk` : `${clip.label} – wycisz`}
              className={`relative block aspect-video w-full cursor-pointer overflow-hidden bg-black text-left ${FOCUS_RING}`}
            >
              {/* podkład w stylu "mapy" – canvas wjeżdża nad niego fade-inem,
                  bez błysku i skoku koloru przy podmianie */}
              <img
                src={clip.poster}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover [filter:grayscale(0.85)_brightness(0.72)]"
              />
              {near && mode === 'gl' && (
                <Suspense fallback={null}>
                  <ShowreelGL
                    clips={uniqueClips}
                    activeIndex={activeIndex}
                    muted={muted}
                    onDegrade={() => setMode('fallback')}
                    onAutoMuted={() => setMuted(true)}
                    onScanState={(scanning) => {
                      if (scanning) setScanTick((t) => t + 1)
                    }}
                  />
                </Suspense>
              )}

              {/* pigułka statusu dźwięku */}
              <span
                className={`absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3 py-1.5 text-[0.6rem] font-light uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm transition-opacity duration-300 md:bottom-4 md:right-4 ${
                  muted ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${muted ? 'bg-white/40' : 'bg-red-500'}`} />
                {muted ? 'Dźwięk wył.' : 'Dźwięk wł.'}
              </span>

              {/* pasek postępu skanu przy dolnej krawędzi kadru */}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
              {scanTick > 0 && (
                <span
                  key={scanTick}
                  aria-hidden="true"
                  className="showreel-scan absolute bottom-0 left-0 h-px w-full origin-left bg-red-600"
                />
              )}
            </button>
          )}
        </div>

        {/* wiersz meta: współrzędne + selektor klipów */}
        <div className="mx-auto mt-4 flex w-full max-w-[80rem] flex-wrap items-center justify-between gap-x-6 gap-y-3 md:mt-6">
          <div className="flex items-center gap-3 text-[0.65rem] font-light uppercase tracking-[0.3em] text-white/50 md:text-xs">
            <span className="tabular-nums">53.1235 N / 18.0084 E</span>
            <span aria-hidden="true" className="text-[0.6rem] text-red-600">✦</span>
            <span>Bydgoszcz</span>
          </div>

          {uniqueClips.length > 1 && (
            <div role="group" aria-label="Wybór klipu" className="flex flex-wrap items-center gap-2 md:gap-3">
              {uniqueClips.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  className={`flex items-center gap-2 rounded-full border bg-black/50 px-4 py-1.5 text-[0.6rem] font-light uppercase tracking-[0.25em] backdrop-blur-sm transition-colors duration-300 ${
                    i === activeIndex
                      ? 'border-white/70 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/40 hover:text-white/80'
                  } ${FOCUS_RING}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === activeIndex ? 'bg-red-500' : 'bg-white/40'
                    }`}
                  />
                  <span className="tabular-nums">{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Showreel
