import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

    const Dawid = ({ dawidSectionRef }) => {


      
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



        }, { scope: dawidSectionRef })


  return (
    <>
    <section ref={dawidSectionRef} className='section relative h-[200svh] w-screen flex-none z-20 bg-lime-950 md:bg-neutral-950 text-white flex flex-col justify-start items-center'>
      <div className='container relative max-w-[120rem] w-full flex flex-col justify-between test'>

        <div className='title flex flex-col gap-6 p-6 md:p-12 xl:px-16 xl:py-12'>
          <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-3xl md:font-light'>
            <div className='md:'>02</div>
            <div className='uppercase' >Trochę o mnie</div>
          </div>

          <div className='flex flex-col max-w-3xl uppercase w-full md:w-fit'>
            <h2 className='text-4xl md:text-6xl lg:text-8xl '>Jestem Dawid</h2>
            <div className='text-sm md:text-base lg:text-xl w-full md:justify-end'>
              <p className='text-justify after:inline-block after:w-full md:text-right'>Zwyky chlopak z zajawką</p>
            </div>
          </div>
        </div>

        <div className='absolute inset-0 h-[100svh] flex flex-col items-center justify-center'>
          <img 
            src='/photos/dawid.png'
            className='max-w-3xl h-[50svh]'
            />
        </div>
      </div>
    </section>


    </>
  )
}

export default Dawid