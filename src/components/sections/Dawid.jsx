import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

    const Dawid = () => {

      const dawidSectionRef = useRef()
      
        useGSAP(() => {
      
          gsap.fromTo('img', {
            opacity: 0.0,
            // scale: 0
          }, {
            opacity: 1.0,
            // scale: 1,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: 'img',
                start: 'top center',
                // end: '+=100%',
                scrub: true
            }
          })

            ScrollTrigger.create({
                trigger: 'img',
                start: 'center center',
                pin: true,
                endTrigger: dawidSectionRef.current,
                end: 'bottom bottom',
                scrub: true
              })

              ScrollTrigger.create({
                trigger: '.title',
                start: 'top top',
                pin: true,
                endTrigger: dawidSectionRef.current,
                end: 'bottom bottom',
                scrub: true
              })


        }, { scope: dawidSectionRef })


  return (
    <section ref={dawidSectionRef} className='relative h-[400svh] z-20 bg-neutral-950 text-white flex flex-col justify-start items-center w-full'>
      <div className='max-w-[120rem] w-full flex flex-col justify-between  '>

        <div className='title flex flex-col gap-6 p-6 md:p-12 xl:px-16 xl:py-12'>
          <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-3xl md:font-light'>
            <div className='md:'>02</div>
            <div className='' >Trochę o mnie</div>
          </div>

          <div className='flex flex-col max-w-3xl w-full'>
            <h2 className='text-4xl md:text-6xl lg:text-8xl uppercase'>Jestem Dawid</h2>
          </div>
        </div>

        <div className='h-[100svh] flex flex-col items-center justify-center'>
          <img 
            src='/photos/dawid.png'
            className='max-w-3xl h-[50svh]'
            />
        </div>
      </div>

    </section>
  )
}

export default Dawid