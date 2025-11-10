import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Hero = () => {

  const sectionRef = useRef()

  useGSAP(() => {

     const mm = gsap.matchMedia();

  /**
   * logo
   */
// scale
    gsap.to('.logo', {
        scale: 0.5,
        scrollTrigger: {
            trigger: 'img',
            start: 'top top',
            endTrigger: '.logo',
            end: 'top top',
            scrub: true,
        }
    })
  // pin
    ScrollTrigger.create({
        trigger: '.logo',
        start: 'top top',
        endTrigger: 'video',
        end: 'center top',
        pin: true,
        scrub: true,
    })

      /**
       * button
       */
      gsap.to('.button', { opacity: 0, scrollTrigger: { trigger: 'img', start: 'top top', end: 'bottom top', scrub: true } })

  //     /**
  //      * video 
  //      */
      mm.add("(max-width: 767px)", () => {
        gsap.to('video', {
          scale: 1.2,
          // ease: 'power1.inOut',
          scrollTrigger: {
              trigger: 'video',
              start: 'top 5%',
              end: '+=100%',
              scrub: true,
              pin: true,
              anticipatePin: 1,
          }
        })
      })

      mm.add("(min-width: 768px)", () => {
        gsap.to('video', {
          scale: 2,
          // ease: 'power1.inOut',
          scrollTrigger: {
              trigger: 'video',
              start: 'center center',
              end: '+=100%',
              scrub: true,
              pin: true,
              anticipatePin: 1,
          }
        })
      })

// pin

    }, { scope: sectionRef })

  return (
        <section ref={sectionRef} className="h-[200svh] flex flex-col justify-center  bg-gradient-to-b from-[#c8e5fc] via-[#ffffff] via-15% to-[#ffffff]">
          <header className="h-[100svh] absolute inset-x-0 top-[0svh] flex flex-col justify-top items-center gap-4 ">
            <img src='images/dron.png' className=" w-32" />
            <div className="logo text-center">
              <h2 className="pinyon-script-regular leading-[0.5] z-10 text-[#ff2946] text-4xl">Dawid</h2>
              <h1 className="orbitron uppercase leading-[0.8] font-extrabold text-4xl text-center text-[#333]">Drone <br/> Operator</h1>
            </div>
            <div  className="button bg-neutral-800 rounded-full px-4 py-2 w-64 text-white text-center"> Napisz do mnie! </div>
          </header>

          <div className='h-[90svh] md:h-[70svh] md:mt-24 md:max-w-5xl md:mx-auto px-4 w-full rounded-2xl'> 
            <video 
                src='videos/rolka.mov' 
                autoPlay 
                loop
                muted 
                className='object-cover w-full h-full rounded-2xl' 
                /> 
          </div> 
        </section>
  )
}

export default Hero