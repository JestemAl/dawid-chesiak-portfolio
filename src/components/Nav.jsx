import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React from 'react'

const Nav = () => {

    useGSAP(() => {
        gsap.from('nav', {
            autoAlpha: 0,
            x: -100,
            duration: 1,
            delay: 1,
        })
    })

  return (
    <nav className='absolute top-0 flex w-full z-50 py-4 gap-8 px-6 md:text-2xl font-light text-black'>
        <button className='cursor-pointer'>Oferta</button>
        <button className='cursor-pointer'>O mnie</button>
        <button className='cursor-pointer'>Sprzęt</button>
        <button className='cursor-pointer'>Galeria</button>
    </nav>
  )
}

export default Nav