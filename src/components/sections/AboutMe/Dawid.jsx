import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React from 'react'
import { dawidFacts } from '../../../constants'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Dawid = ({ dawidSectionRef }) => {

  useGSAP(() => {
    let mm
    const id = requestAnimationFrame(() => {
      mm = gsap.matchMedia()
      // fade zdjęcia tylko na desktopie – na mobile kadr jest częścią układu sekcji
      mm.add('(min-width: 779px)', () => {
        const img = dawidSectionRef.current?.querySelector('.dawid-photo')
        if (!img) return
        gsap.fromTo(img,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'power1.inOut',
            scrollTrigger: { trigger: img, start: 'top center', scrub: true },
          }
        )
      })
    })
    return () => {
      cancelAnimationFrame(id)
      mm?.revert()
    }
  }, { scope: dawidSectionRef })

  return (
    <section ref={dawidSectionRef} className='section relative h-[200svh] md:h-screen w-screen flex-none z-20  md:bg-neutral-950 text-white flex flex-col justify-start items-center'>

      {/* MOBILE – układ spójny z sekcją 03: nagłówek, kadr, dane w siatce */}
      <div className='md:hidden absolute inset-x-0 top-0 flex h-[100svh] flex-col p-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex w-full justify-between font-light text-sm'>
            <div>02</div>
            <div className='uppercase'>Trochę o mnie</div>
          </div>

          <div className='flex flex-col uppercase'>
            <h2 className='text-4xl'>Jestem Dawid</h2>
            <p className='text-sm text-white/60'>zwykły chłopak z zajawką</p>
          </div>
        </div>

        <img
          src='/photos/dawid-600.webp'
          srcSet='/photos/dawid-600.webp 600w, /photos/dawid-1200.webp 1200w'
          sizes='90vw'
          alt='Dawid Chęsiak – operator drona, Bydgoszcz'
          width='600'
          height='748'
          loading='lazy'
          decoding='async'
          /* wysokość elastyczna (nie proporcja od szerokości) – na niskich ekranach
             kadr się kurczy zamiast wypychać dane poza 100svh, jak w sekcji 03 */
          className='mt-6 w-full min-h-0 flex-1 max-h-[52svh] object-cover'
        />

        <dl className='mt-auto grid grid-cols-2 gap-x-4 gap-y-4 pt-6'>
          {dawidFacts.map((item, i) => (
            <div key={i}>
              <dt className='uppercase font-medium leading-tight'>{item.title}</dt>
              <dd className='text-sm font-light'>{item.desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* DESKTOP – układ bez zmian */}
      <div className='hidden max-w-[80rem] md:h-[80vh] md:mt-[10vh] w-full md:flex flex-col justify-between md:self-center  md:p-12 xl:px-16 xl:py-12 h-[50svh]'>

        <div className='absolute inset-0 h-[100svh] flex flex-col  md:flex-row md:items-center md:justify-center w-full'>

          <div className='relative p-6 h-full md:h-[50svh] md:pt-[3vh] md:max-w-5xl flex flex-col justify-between md:grid md:grid-cols-8 md:grid-rows-1'>

            <div className='text-xl  font-light mb-2 md:col-start-1 md:col-span-3 z-10 leading-[0.9] space-y-4'>
              <div className='md:text-5xl 2xl:text-6xl'> Latam dronem już od ponad 5 lat</div>
            </div>

            <div className='md:col-end-7 md:col-span-4 flex justify-center w-full'>
              <img
                src='/photos/dawid-600.webp'
                srcSet='/photos/dawid-600.webp 600w, /photos/dawid-1200.webp 1200w'
                sizes='600px'
                alt='Dawid Chęsiak – operator drona, Bydgoszcz'
                width='600'
                height='748'
                loading='lazy'
                decoding='async'
                className='dawid-photo max-h-[50vh] object-cover w-full '
              />
            </div>
            <div className='hidden md:block self-end md:col-start-7 font-extralight md:text-4xl md:col-span-2 md:ml-4'> Działam w Bydgoszczy i okolicach </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Dawid
