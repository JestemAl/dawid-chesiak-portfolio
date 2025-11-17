import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'
import { services } from '../../constants/index'

gsap.registerPlugin(useGSAP, ScrollTrigger)

    const About = () => {

      const aboutSectionRef = useRef()

      useGSAP(() => {
        ScrollTrigger.create({
          trigger: aboutSectionRef.current,
          start: "top top",
          pin: true,
          pinSpacing: false,
          scrub: true

        })
      }, {scope: aboutSectionRef})
      

  return (
    <section ref={aboutSectionRef} className='h-[150vh] w-screen z-20 bg-stone-200 flex flex-col justify-start items-center'>
      <div className='relative max-w-[120rem] w-full flex flex-col justify-between p-6 md:p-12 xl:px-16 xl:py-10 h-[100svh]'>

        <div className='flex flex-col gap-4'>
          <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-2xl md:font-light'>
            <div className='md:'>01</div>
            <div className='uppercase' >To moja pasja</div>
          </div>

          <div className='uppercase flex flex-col max-w-xl w-full'>
            <h2 className='text-4xl md:text-6xl lg:text-6xl '>Zobacz świat z innej perspektywy</h2>
            <div className='flex text-sm md:text-base lg:text-lg justify-between md:justify-end md:gap-3 bg-black text-white md:w-fit md:ml-auto px-2 md:py-1'>
              <p className=''>nagrania dronem </p>
              <p className=''>| </p>
              <p className=''> fotografia</p>
            </div>
          </div>
        </div>

        <dl className="md:absolute md:inset-0 md:w-fit md:h-[screen] md:pt-[10vh] md:justify-center md:items-start w-fit flex flex-col mx-auto space-y-4 md:space-y-4">
            {services.map(({ title, desc }, i) => (
              <div
                key={i}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-black/10 first:border-t-0"
              >
                <dt className="flex-none uppercase text-xl md:text-2xl xl:text-4xl font-medium leading-tight">
                  {title}
                </dt>
                <dd className="flex-1 basis-[28rem] text-sm md:text-2xl xl:text-4xl md:basis-[36rem] min-w-[16rem] font-light ">
                  {desc}
                </dd>
              </div>
            ))}
          </dl>

          
        <div className='font-light text-right text-xs md:text-2xl uppercase'>
            Jak chcesz coś więcej — nie bój się zapytać!
        </div>

      </div>
    </section>
  )
}

export default About