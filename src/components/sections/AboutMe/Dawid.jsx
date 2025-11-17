import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'
import { dawid } from '../../../constants'

gsap.registerPlugin(useGSAP, ScrollTrigger)

    const Dawid = ({ dawidSectionRef }) => {


      
        useGSAP(() => {
      
          const img = gsap.utils.toArray("img")

          gsap.fromTo('img', {
            opacity: 0.0,
            // scale: 0
          }, {
            opacity: 1.0,
            // scale: 1,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: img,
                start: 'top center',
                // end: '+=100%',
                scrub: true,
                markers: true
            }
          })
        }, { scope: dawidSectionRef })


  return (
    <>
    <section ref={dawidSectionRef} className='section relative h-[200svh] w-screen flex-none z-20  md:bg-neutral-950 text-white flex flex-col justify-start items-center'>
      <div className='max-w-[80rem] md:h-[80vh] md:mt-[10vh] w-full flex flex-col justify-between md:self-center  md:p-12 xl:px-16 xl:py-12 h-[100svh]'>

        <div className='absolute inset-0 h-[100svh] flex flex-col  md:flex-row md:items-center md:justify-center w-full'>
          
          <div className='relative p-6 h-full md:h-[50svh] md:pt-[3vh] md:max-w-5xl flex flex-col justify-between md:grid md:grid-cols-8 md:grid-rows-1'>
            <div className='abouTitle md:hidden md:absolute inset-0 md:h-screen w-full z-50 text-white flex justify-center'>
              <div className='max-w-[120rem] w-full md:item  md:p-12 xl:px-16 xl:py-10 '>
                  <div className='title flex flex-col gap-4 '>
                  <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-2xl md:font-light'>
                      <div className='md:'>02</div>
                      <div className='uppercase' >Trochę o mnie</div>
                  </div>

                  <div className='flex flex-col max-w-3xl uppercase w-full md:w-fit'>
                      <h2 className='text-4xl md:text-6xl lg:text-7xl '>Jestem Dawid</h2>
                      <div className='text-sm md:text-base lg:text-xl w-full md:justify-end'>
                      <p className='text-justify after:inline-block after:w-full md:text-right'>Zwyky chlopaka z zajawką</p>
                      </div>
                  </div>
                  </div>
              </div>
          </div>

          <div className='text-2xl  font-extralight mb-2 md:col-start-1 md:col-span-3 z-10 leading-[0.9] space-y-4'>
            <div className='md:text-6xl '> Latam dronem już od ponad 5 lat</div>
            <div className='md:hidden md:col-start-7 md:col-span-2'> Działam w Bydgoszczy i okolicach </div>
          </div>


            <div className='md:col-end-7 md:col-span-4 flex justify-center w-full'>
              <img 
                src='/photos/dawid.png'
                className='max-h-[50vh] object-cover w-full '
              />
            </div>
            <div className='hidden md:block self-end md:col-start-7 font-extralight md:text-4xl md:col-span-2 md:ml-4'> Działam w Bydgoszczy i okolicach </div>
          </div>
        </div>

      </div>
    </section>


    </>
  )
}

export default Dawid