import React, { useRef } from 'react'
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

    
    useGSAP( () => {


    const sections = gsap.utils.toArray('.section')

    let mm = gsap.matchMedia()



    
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

        ScrollTrigger.create({
            trigger: dawidSectionRef.current,
            pin: true,
            end: 'bottom bottom',
            scrub: true
        })

        ScrollTrigger.create({
            trigger: dronSectionRef.current,
            pin: true,
            // end: 'bottom bottom',
            scrub: true,
            // markers: true
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
                // markers: true,
                // onUpdate: (self) => { console.log('progress', self.progress) }
            }
        })

        // gsap.set('.svg-loader', { opacity: 0 })
        // gsap.to('.svg-loader', { opacity: 1, duration: 1, scrollTrigger: { trigger: dawidSectionRef.current, start: 'top center', scrub: true,  }})

        ScrollTrigger.create({
            trigger: '.svg-loader',
            start: 'top 90%',
            endTrigger: horizontalSectionRef.current,
            end: 'bottom bottom',
            pin: true,
            // pinSpacing: false,
            // anticipatePin: true,
            scrub: true,
            markers: true
        }) 

        gsap.set("#linePath", { drawSVG: "0% 0%" });

        // rysuj linię wg progresu horyzontalnego
        horizontalTween.eventCallback("onUpdate", () => {
        const p = horizontalTween.progress();           // 0..1
        gsap.set("#linePath", { drawSVG: `${p * 100}% 0%` });
        });

    })

    }, { scope: horizontalSectionRef })

  return (
    <section ref={horizontalSectionRef} className='relative z-20 flex flex-col md:flex-row w-full bg-neutral-950'>
        <Dawid dawidSectionRef={dawidSectionRef} />
        <Dron dronSectionRef={ dronSectionRef} />

        <div className='svg-loader absolute w-full top-[45%] z-30'>
            <svg
                id="path"
                width="70vw"
                height="2"
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
                className="z-40 absolute left-1/2 -translate-x-1/2"
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
                width="70vw"
                height="2"
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
                className="z-30 absolute left-1/2 -translate-x-1/2"
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

    </section>
  )
}

export default AboutMe