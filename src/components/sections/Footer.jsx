import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef } from 'react'

const Footer = () => {

const footerRef = useRef()

useGSAP(() => {

  gsap.from(footerRef.current, {
    y: 500,
    duration: 1,
    autoAlpha: 0,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: footerRef.current,
      statusbar: 'top 80%',
      toggleActions: "play none none none"
    }
  })
})

  return (
    <section ref={footerRef} className='h-[70vh] bg-white'>
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-sm tracking-[0.2em] uppercase font-semibold text-zinc-400">
          Dawid – Drone Operator
        </p>

        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-center md:gap-6">
          <div className="flex justify-center gap-1 text-sm">
            <span className="text-zinc-400">Telefon:</span>
            <a
              href="tel:+48123456789"
              className="hover:text-zinc-50 transition"
            >
              +48 123 456 789
            </a>
          </div>

          <div className="flex justify-center gap-1 text-sm">
            <span className="text-zinc-400">E-mail:</span>
            <a
              href="mailto:kontakt@dawiddrone.pl"
              className="hover:text-zinc-50 transition"
            >
              kontakt@dawiddrone.pl
            </a>
          </div>

          <div className="flex justify-center gap-1 text-sm">
            <span className="text-zinc-400">Instagram:</span>
            <a
              href="https://instagram.com/dawid_drone"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-50 transition"
            >
              @dawid_drone
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Dawid – Drone Operator
        </p>
      </div>
    </section>
  )
}

export default Footer