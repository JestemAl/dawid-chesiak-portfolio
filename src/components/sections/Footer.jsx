import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef } from 'react'
import FitText from '../text/FitText'

const Footer = () => {

const footerRef = useRef()

useGSAP(() => {

  // gsap.from(footerRef.current, {
  //   y: 500,
  //   duration: 1,
  //   autoAlpha: 0,
  //   ease: 'power2.inOut',
  //   scrollTrigger: {
  //     trigger: footerRef.current,
  //     statusbar: 'top 80%',
  //     toggleActions: "play none none none"
  //   }
  // })
  
})

  return (
    <section ref={footerRef} className='min-h-[60vh] bg-white flex flex-col justify-between '>

      <div className=" text-center h-fit pt-2">
        <FitText
          text="Do zobaczenia"
          min={16}
          max={450}
          horizontalPadding={8}
          textClassName="font-black tracking-tight uppercase leading-[0.85] big-shoulders"
          />
      </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-0 text-2xl md:text-3xl text-neutral-700 w-full ">
          <div className="flex flex-col px-2 md:items-center md:gap-0 font-light">
            <span className="text-neutral-900 font-semibold text-xl ">Telefon:</span>
            <a
              href="tel:+48123456789"
            >
              +48 123 456 789
            </a>
          </div>

          <div className="flex flex-col  px-2 md:items-center md:gap-0 font-light md:mx-8">
            <span className="text-neutral-900 font-semibold text-xl">E-mail:</span>
            <a href="mailto:kontakt@dawiddrone.pl">
              kontakt@dawiddrone.pl
            </a>
          </div>

          <div className="flex flex-col  px-2 md:items-center md:gap-0 font-light">
            <span className="text-neutral-900 font-semibold text-xl">Instagram:</span>
            <a
              href="https://instagram.com/air_d.a.v.e"
              target="_blank"
              rel="noreferrer"
            > @air_d.a.v.e
            </a>
          </div>
        </div>

      <div>
        <p className="text-xs py-3 text-center w-full bg-neutral-950 text-white">
          © {new Date().getFullYear()} Dawid Chęsiak
        </p>
      </div>

  

    </section>
  )
}

export default Footer