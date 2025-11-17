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


    const sections = gsap.utils.toArray('.section')

    let mm = gsap.matchMedia()

    ScrollTrigger.create({
        trigger: dronSectionRef.current,
        pin: true,
        scrub: true
    })
        

    mm.add("(max-width: 778px)", () => {
        ScrollTrigger.create({
            trigger: dawidSectionRef.current,
            pin: true,
            scrub: true
        })

    })

  
    mm.add("(min-width: 779px)", () => {

        ScrollTrigger.create({
            trigger: dawidSectionRef.current,
            pin: true,
            end: 'bottom bottom',
            scrub: true
        })

        ScrollTrigger.create({
            trigger: '.abouTitle',
            pin: true,
            scrub: true,
        })


        const horizontalTween = gsap.to(sections, {
            xPercent: -100 ,
            ease: 'none',
            scrollTrigger: {
                trigger: horizontalSectionRef.current,
                // trigger: '.section',
                start: 'center top',
                pin: true,
                anticipatePin: 1,
                scrub: true,
                end: () => '+=' + horizontalSectionRef.current.offsetWidth,
            }
        })
        

        ScrollTrigger.create({
            trigger: '.svg-loader',
            start: 'top 85%',
            endTrigger: horizontalSectionRef.current,
            end: 'bottom bottom',
            pin: true,
            // pinSpacing: false,
            // anticipatePin: true,
            scrub: true,
            // markers: true
        }) 

        gsap.set("#linePath", { drawSVG: "0% 0%" });

        // rysuj linię wg progresu horyzontalnego
        horizontalTween.eventCallback("onUpdate", () => {
        const p = horizontalTween.progress();      
        if(p > 0.5) setProgressState(true)  
            else setProgressState(false) 
        gsap.set("#linePath", { drawSVG: `${p * 100}% 0%` });
        });
    })

    

    }, { scope: horizontalSectionRef })

  return (
    <section ref={horizontalSectionRef} className='relative z-20 flex bg-neutral-950 flex-col md:flex-row w-full bg-neutral-950'>

        <div className='title abouTitle hidden absolute inset-0 h-screen w-full z-50 text-white md:flex justify-center'>
            <div className='max-w-[120rem] w-full md:item p-6 md:p-12 xl:px-16 xl:py-10 h-[100svh]'>
                <div className='title flex flex-col gap-4 '>
                <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-2xl md:font-light'>
                    <div className='md:'>02</div>
                    <div className='uppercase' >Trochę o mnie</div>
                </div>

                <div className='flex flex-col max-w-3xl uppercase w-full md:w-fit'>
                    <h2 className='text-4xl md:text-6xl lg:text-7xl '>Jestem Dawid</h2>
                    <div className='text-sm md:text-base lg:text-xl w-full md:justify-end'>
                    <p className='text-justify after:inline-block after:w-full md:text-right'>Zwyky chlopak z zajawką</p>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <Dawid dawidSectionRef={dawidSectionRef} />
        <Dron dronSectionRef={ dronSectionRef} />

        <div className='svg-loader hidden md:flex absolute w-full top-[40%] z-30 items-center justify-center gap-4'>
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