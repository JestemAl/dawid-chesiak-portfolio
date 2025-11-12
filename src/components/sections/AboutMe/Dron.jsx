import React, { useRef } from 'react'

const Dron = ({dronSectionRef}) => {

  return (
        
    <section ref={dronSectionRef} className='section relative z-30 bg-neutral-950 h-[100svh] w-screen text-white  flex-none flex flex-col justify-start items-center'>
      {/* <div className='md:h-screen'></div> */}

      <div  className='relative   max-w-[120rem] w-full flex flex-col justify-between test'>
        
        <div className='title flex flex-col items-end gap-6 p-6 md:p-12 xl:px-16 xl:py-12'>
          <div className='w-full flex justify-between md:justify-end md:space-x-4 font-light text-sm md:text-xl xl:text-3xl md:font-light'>
            <div className='md:'>03</div>
            <div className='uppercase' >mój sprzęt</div>
          </div>

          <div className='flex flex-col max-w-3xl uppercase w-full md:w-fit'>
            <h2 className='text-4xl md:text-6xl lg:text-8xl '>DJJ Mini 3</h2>
            <div className='text-sm md:text-base lg:text-xl w-full md:justify-end'>
              <p className='text-justify after:inline-block after:w-full md:text-left'>tym sobie latam</p>
            </div>
          </div>
        </div>

        <div className='container absolute h-screen flex flex-col items-center justify-center'>
          <img 
            src='/images/djj-mini.png'
            className='max-w-3xl h-[50svh] bg-white'
            />
        </div>

      </div>

    </section>
  )
}

export default Dron