import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'
import FitText from '../text/FitText'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin)

const Hero = () => {
    const sectionRef = useRef() 

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
            <div className='ig-icon absolute top-0 mt-[2vh] z-30 mb-[4vh] px-3 md:px-4 flex items-center gap-2 md:gap-4 text-3xl md:text-5xl '>
              <img src='svg/instagram.svg' className=' w-12 md:w-20 mix-blend-normal' /> 
              <div className='text-neutral-700 font-light'>air_d.a.v.e</div>
            </div>
          </a>

           <header className='absolute inset-0 top-0 z-10 w-full h-fit pr-1 bg-white mix-blend-screen backdrop-blur-3xl transform-gpu will-change-transform select-none rounded-none'>

            <div className='mt-[2vh] mb-[4vh] flex items-center gap-2 md:gap-4 text-3xl md:text-5xl opacity-0 '>
              <div className='w-12 h-12 md:h-20 md:w-20 mix-blend-normal' /> 
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
            <div className='flex flex-col text-2xl md:text-5xl p-4 md:p-6  md:max-w-4xl text-white tracking-wide'>
              <div className='font-semibold text-sm md:text-5xl text-justify pb-2 md:pb-4 md:text-right'>Bydgoszcz i okolice</div>
              <div className=''> Nagrania i zdjęcia przy pomocy drona </div>
            </div>
        </div>


          <div className='absolute top-0 w-full h-[100svh]'> 
            <video 
                autoPlay 
                loop
                muted 
                className='object-cover w-full h-full ' 
                playsInline
                preload="auto"
                // poster="/images/rolka-poster.jpg"
                > 
                  <source src="videos/rolka.webm" type="video/webm" />
                  <source src="videos/rolka.mp4" type="video/mp4" />
                  {/* <source src="videos/rolka.mov" type="video/mov" /> */}
              </video>
          </div> 
        </section>
  )
}

export default Hero