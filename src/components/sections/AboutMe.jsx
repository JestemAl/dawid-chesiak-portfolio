import React, { useRef, useState } from 'react'
import Dawid from './AboutMe/Dawid'
import Dron from './AboutMe/Dron'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin) 

const AboutMe = () => {

    const horizontalSectionRef = useRef()
    const dawidSectionRef = useRef()
    const dronSectionRef = useRef()

    const [progressState, setProgressState] = useState(false)
    
    useGSAP( () => {
      const id = requestAnimationFrame(() => {
        const sections = gsap.utils.toArray('.section')

        const mm = gsap.matchMedia()

        mm.add("(max-width: 778px)", () => {
            ScrollTrigger.create({
                trigger: dawidSectionRef.current,
                pin: true,
                scrub: true
            })

            ScrollTrigger.create({
                trigger: dronSectionRef.current,
                pin: true,
                scrub: true
            })
        })

        mm.add("(min-width: 779px)", () => {
            // Jeden pin na cały kontener zamiast pięciu nakładających się pinów.
            // Rytm: przystanek na panelu Dawida (czas na przeczytanie) -> przejazd
            // -> przystanek na panelu drona. Zero martwego scrolla między treściami.
            const container = horizontalSectionRef.current
            const HOLD = 0.35   // udział "przystanku" w osi czasu (move ma duration 1)
            const TOTAL = 1 + HOLD * 2

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: () => '+=' + (container.scrollWidth - window.innerWidth) * TOTAL,
                    pin: true,
                    anticipatePin: 1,
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            })

            tl.to({}, { duration: HOLD }, 0)
            tl.to(sections, { xPercent: -100, ease: 'none', duration: 1 }, HOLD)
            tl.to({}, { duration: HOLD }, HOLD + 1)
            // tytuł "Jestem Dawid" schodzi zanim wjedzie panel z dronem
            tl.to('.abouTitle', { autoAlpha: 0, duration: 0.25 }, HOLD + 0.15)

            gsap.set("#linePath", { drawSVG: "0% 0%" });

            tl.eventCallback("onUpdate", () => {
              // pasek postępu śledzi sam przejazd, nie przystanki
              const p = gsap.utils.clamp(0, 1, tl.progress() * TOTAL - HOLD)
              setProgressState(p > 0.5)
              gsap.set("#linePath", { drawSVG: `${p * 100}% 0%` });
            });
        })
      })

      return () => cancelAnimationFrame(id)
    }, { scope: horizontalSectionRef })

  return (
    <section ref={horizontalSectionRef} id='o-mnie' className='relative z-20 flex flex-col md:flex-row w-full bg-neutral-950'>

        <div className='title abouTitle hidden absolute inset-0 h-screen w-full z-50 text-white md:flex justify-center'>
            <div className='max-w-[120rem] w-full md:item p-6 md:p-12 xl:px-16 xl:py-10 h-[100svh]'>
                <div className='title flex flex-col gap-4 '>
                <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-2xl md:font-light'>
                    <div>02</div>
                    <div className='uppercase' >Trochę o mnie</div>
                </div>

                <div className='flex flex-col max-w-3xl uppercase w-full md:w-fit'>
                    <h2 className='text-4xl md:text-6xl lg:text-7xl '>Jestem Dawid</h2>
                    <div className='text-sm md:text-base lg:text-xl w-full md:justify-end'>
                    <p className='text-justify after:inline-block after:w-full md:text-right'>Zwykły chłopak z zajawką</p>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <Dawid dawidSectionRef={dawidSectionRef} />
        <Dron dronSectionRef={ dronSectionRef} />

        <div className='svg-loader hidden md:flex absolute w-full top-[86%] z-30 items-center justify-center gap-4'>
            {/* <div className=''> */}
                <div className='text-white uppercase'> o mnie</div>
                <div className='w-[70vw] '>
                <svg
                    id="path"
                    height="2"
                    viewBox="0 0 100 2"
                    preserveAspectRatio="none"
                    className="z-40  w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                <path
                    id="linePath"
                    d="M0 1 H100"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                </svg>

                <svg

                    height="2"
                    viewBox="0 0 100 2"
                    preserveAspectRatio="none"
                    className="z-30  w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                <path
                    d="M0 1 H100"
                    fill="none"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                </svg>
            </div>
            <div className={`uppercase ${progressState ? 'text-white' : 'text-neutral-500'}`}> Dron</div>
            {/* </div> */}
        </div>

    </section>
  )
}

export default AboutMe