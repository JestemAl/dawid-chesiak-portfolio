import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef, useState } from 'react'
import { galleryPhotos } from '../../../constants'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Galeria mobilna: sekcja pinowana, scroll w dół przesuwa taśmę zdjęć w bok
// przez wszystkie kadry. Dodatkowo obraz jest o 35% wyższy od ramki i ta
// nadwyżka to droga pionowego panoramowania: kadr wjeżdżający z prawej
// pokazuje górę ujęcia, wyśrodkowany środek, wyjeżdżający w lewo dół.

const OVERFLOW = 1.35
const SPAN = ((OVERFLOW - 1) / OVERFLOW) * 100 // 25,93% wysokości obrazu
const EDGE = 24 // px-6 – oddech na końcu taśmy
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

export default function GalleryMobile() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      let mm
      // deferral jak w reszcie repo – pierwsza klatka nie czeka na GSAP
      const id = requestAnimationFrame(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        const cards = gsap.utils.toArray('figure', track)
        if (!cards.length) return
        const setY = cards.map((card) => gsap.quickSetter(card.querySelector('img'), 'yPercent'))
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const last = cards[cards.length - 1]

        // pozycje kadrów liczone raz na refresh – render nie czyta layoutu
        let centers = []
        let baseLeft = 0
        const measure = () => {
          centers = cards.map((card) => card.offsetLeft + card.clientWidth / 2)
          baseLeft = track.getBoundingClientRect().left - (gsap.getProperty(track, 'x') || 0)
        }
        const distance = () =>
          Math.max(1, last.offsetLeft + last.clientWidth + EDGE - window.innerWidth)

        const render = () => {
          const x = gsap.getProperty(track, 'x') || 0
          const half = window.innerWidth / 2
          let nearest = 0
          let best = Infinity

          for (let i = 0; i < cards.length; i++) {
            const offset = baseLeft + centers[i] + x - half
            const dist = Math.abs(offset)
            if (dist < best) {
              best = dist
              nearest = i
            }
            if (reduce) continue
            // -1 = kadr wyjechał w lewo, 0 = na środku, 1 = czeka po prawej
            const p = clamp(offset / window.innerWidth, -1, 1)
            setY[i]((SPAN / 2) * (p - 1))
          }

          if (nearest !== activeRef.current) {
            activeRef.current = nearest
            setActive(nearest)
          }
        }

        if (reduce) {
          // bez ruchu: każdy kadr zatrzymany na środku zdjęcia
          cards.forEach((card) => gsap.set(card.querySelector('img'), { yPercent: -SPAN / 2 }))
        }

        mm = gsap.matchMedia()
        // tylko mobile – na desktopie ten komponent jest ukryty (display:none)
        mm.add('(max-width: 778px)', () => {
          measure()
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + distance(),
              pin: true,
              anticipatePin: 1,
              scrub: true,
              invalidateOnRefresh: true,
              onRefresh: () => {
                measure()
                render()
              },
              onUpdate: render,
            },
          })
          render()
          return () => tween.scrollTrigger?.kill()
        })
      })

      return () => {
        cancelAnimationFrame(id)
        mm?.revert()
      }
    },
    { scope: sectionRef }
  )

  const total = String(galleryPhotos.length).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] flex-col justify-between overflow-hidden bg-neutral-950 py-10 text-white"
    >
      <div className="title flex flex-col gap-4 px-6">
        <div className="flex w-full justify-between font-light text-sm">
          <div aria-hidden="true">✦</div>
          <div className="uppercase">Realizacje</div>
        </div>

        <div className="flex w-full flex-col uppercase">
          <h2 className="text-4xl">Moje realizacje</h2>
          <p className="text-sm text-white/60">scrolluj, kadry lecą w bok</p>
        </div>
      </div>

      <div ref={trackRef} className="relative flex w-max items-center gap-4 pl-6 will-change-transform">
        {galleryPhotos.map(({ id, alt }, i) => (
          <figure
            key={id}
            className="relative h-[60svh] w-[80vw] shrink-0 overflow-hidden bg-black"
          >
            <img
              src={`/photos/fota${id}-800.webp`}
              srcSet={`/photos/fota${id}-800.webp 800w, /photos/fota${id}-1600.webp 1600w`}
              sizes="80vw"
              alt={alt}
              width="800"
              height="450"
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-x-0 top-0 h-[135%] w-full object-cover will-change-transform"
            />
          </figure>
        ))}
      </div>

      {/* licznik + ticki – wiadomo ile kadrów i gdzie jesteśmy */}
      <div className="flex items-center justify-between px-6">
        <span className="text-[0.65rem] font-light uppercase tracking-[0.3em] text-white/50 tabular-nums">
          {String(active + 1).padStart(2, '0')} / {total}
        </span>
        <div aria-hidden="true" className="flex items-center gap-1.5">
          {galleryPhotos.map(({ id }, i) => (
            <span
              key={id}
              className={`h-px transition-all duration-300 ${
                i === active ? 'w-6 bg-red-600' : 'w-3 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
