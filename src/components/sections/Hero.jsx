import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef, useState } from 'react'
import FitText from '../text/FitText'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin)

const Hero = () => {
  const POSTER = "/photos/rolka-poster.webp";
  const BLUR  = "/photos/rolka-poster-blur.webp";

    const sectionRef = useRef() 
    const videoRef = useRef() 
    const [isReady, setIsReady] = useState()

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const START_AT = 2 // sekundy

      const handleLoaded = () => {
        try {
          video.currentTime = START_AT
        } catch (e) {
          // niektóre przeglądarki marudzą przy seeku przed bufforem, ignorujemy
        }
        const p = video.play()
        if (p && p.catch) {
          p.catch(() => {
            // jeśli Safari na Macu zablokuje autoplay, trudno – ale start time i tak jest ustawiony
          })
        }
      }

      if (video.readyState >= 1) {
        // metadata już są
        handleLoaded()
      } else {
        video.addEventListener('loadedmetadata', handleLoaded)
        return () => video.removeEventListener('loadedmetadata', handleLoaded)
      }
    }, [])

    useGSAP(() => {

        ScrollTrigger.create({
            trigger: 'video',
            pin: true,
            end: '+=150%',
            pinSpacing: false
        })

        ScrollTrigger.create({
          trigger: '.hero-text',
          // start: 'bottom bottom',
          pin: true,
          endTrigger: sectionRef.current,
           end: 'bottom bottom',
          scrub: true,
        })

        gsap.from('.ig-icon', {
          autoAlpha: 0,
          duration: 0.5,
          delay: 1
        })

        gsap.fromTo('header', { y: -2000 }, { y:0, duration: 1, ease: 'expo.out' })

    }, { scope: sectionRef })

  return (
        <section ref={sectionRef} className="relative h-[150svh] flex flex-col justify-center  bg-gradient-to-b from-[#c8e5fc] via-[#ffffff] via-15% to-[#ffffff] ">


         {/* <div className='imperial-script-regular absolute top-0 left-1/2 -translate-x-1/2 xl:text-[20rem] xl:-mt-20 text-red-600 z-30'>
            Dawid
          </div> */}

          <a href='https://www.instagram.com/air_d.a.v.e/' target="_blank" >
            <div className='ig-icon absolute top-0 md:right-0 mt-[2vh] z-30 mb-[4vh] px-3 md:px-4 flex md:flex-row-reverse items-center gap-2 md:gap-4 text-3xl xl:text-5xl '>
              <img src='svg/instagram.svg' className=' w-12 md:w-16 xl:w-20 mix-blend-normal' /> 
              <div className='text-neutral-700 font-light'>air_d.a.v.e</div>
            </div>
          </a>

          <img
            src="/podpis/podpis-czerwony.webp"
            alt="Podpis"
            className="absolute md:left-0 top-14 max-md:left-1/2 max-md:-translate-x-1/4 md:top-0 z-30 w-[260px] md:w-[280px]  pointer-events-none mix-blend-normal"
          />

           <header className='absolute inset-0 top-0 z-10 w-full h-fit pr-1 bg-white mix-blend-screen backdrop-blur-3xl transform-gpu will-change-transform select-none rounded-none'>

            <div className='mt-[2vh] mb-[4vh] flex items-center gap-2 md:gap-4 text-3xl md:text-5xl opacity-0 '>
              <div className='w-12 h-24 md:h-20 md:w-20 mix-blend-normal' /> 
            </div>


            <FitText
              text="Drone Operator"
              min={16}
              max={450}
              horizontalPadding={8}
              textClassName="hidden md:block font-black tracking-tight uppercase leading-[0.85] big-shoulders"
            />
            <FitText
              text="Drone"
              min={16}
              max={250}
              horizontalPadding={8}
              textClassName="md:hidden font-black tracking-tight uppercase leading-[0.85] big-shoulders"
            />
            <FitText
              text="Operator"
              min={16}
              max={250}
              horizontalPadding={8}
              textClassName="md:hidden font-black tracking-tight uppercase leading-[0.85] big-shoulders"
            />
        </header>

        <div className='hero-text h-[100svh] absolute inset-0 z-20 flex flex-col font-light justify-end items-end  md:font-extralight w-full'>
            <div className='flex flex-col text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl p-4 md:p-6  md:max-w-4xl text-white tracking-wide'>
              <div className='font-semibold text-sm md:text-2xl xl:text-3xl 2xl:text-5xl text-justify pb-2 xl:pb-4 md:text-right'>Bydgoszcz i okolice</div>
              <div className=''> Nagrania i zdjęcia przy pomocy drona </div>
            </div>
        </div>


          <div className='absolute top-0 w-full h-[100svh]'> 
              {!isReady && (
                <img
                  src={BLUR}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
                />
              )}
            <video 
                ref={ videoRef }
                autoPlay 
                loop
                muted 
                className='object-cover w-full h-full ' 
                playsInline
                preload="metadata"
                poster={POSTER}
                onCanPlay={() => setIsReady(true)} 
                // poster="/images/rolka-poster.jpg"
                > 
                  <source src="videos/rolka-2mbps.webm" type="video/webm" />
                  <source src="videos/rolka-2mbps.mp4" type="video/mp4" />
                  {/* <source src="videos/rolka.mov" type="video/mov" /> */}
              </video>
          </div> 
        </section>
  )
}

export default Hero