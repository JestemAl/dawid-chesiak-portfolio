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
            end: '+=200%',
            pinSpacing: false
        })

    }, { scope: sectionRef })

  return (
        <section ref={sectionRef} className="relative h-[200svh] flex flex-col justify-center  bg-gradient-to-b from-[#c8e5fc] via-[#ffffff] via-15% to-[#ffffff] ">



        <header className='absolute inset-0 top-0 z-10 w-full h-fit pt-[10svh] bg-white flex flex-col items justify-end mix-blend-screen backdrop-blur-3xl select-none rounded-none'>


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


          <div className='absolute top-0 w-full h-[100svh]'> 
            <video 
                src='videos/rolka.mov' 
                autoPlay 
                loop
                muted 
                className='object-cover w-full h-full ' 
                /> 
          </div> 
        </section>
  )
}

export default Hero