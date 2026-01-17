import React, { useRef } from 'react'
import { dronVideo } from '../../../constants'

const Dron = ({dronSectionRef}) => {

  return (
        
    <section ref={dronSectionRef} className='section relative z-30 bg-neutral-950 h-[100svh] w-screen text-white  flex-none flex flex-col justify-start items-center '>
      {/* <div className='md:h-screen'></div> */}

      <div  className='relative max-w-[80rem] w-full flex flex-col justify-between'>
        
  

        <div className='absolute inset-0 h-[100svh] flex  md:flex-row items-center justify-center '>
          
          <div className='p-6 h-[100svh] md:h-[50svh]  md:max-w-5xl flex flex-col justify-between items-center md:grid md:grid-cols-8 md:grid-rows-1 md:gap-x-4'>
            
            <div className='abouTitle md:hidden w-full z-50  text-white flex justify-center'>
              <div className='max-w-[120rem] w-full md:item  ]'>
                  <div className='title flex flex-col gap-4 '>
                  <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-2xl md:font-light'>
                      <div className='md:'>03</div>
                      <div className='uppercase' >mój sprzęt</div>
                  </div>

                  <div className='flex flex-col max-w-3xl uppercase w-full md:w-fit'>
                      <h2 className='text-4xl md:text-6xl lg:text-7xl '>DJI Mini 3 Pro</h2>
                      <div className='text-sm md:text-base lg:text-xl w-full md:justify-end'>
                      <p className='text-justify after:inline-block after:w-full md:text-right'>Dron z 4k</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className='hidden md:block md:self-start md:row-start-1 md:col-span-4 md:text-5xl 2xl:text-6xl z-10 font-light mix-blend-difference'>
                Do nagrywek używam drona <span className='font-semibold '> DJI Mini 3 Pro</span>
            </div>
          <a target='blank' href='https://dji-polska.pl/drony/dji-mini-3-pro/#specification'
            className='md:col-start-3 md:col-span-4 h-[50vh] w-full object-contain mb-2 bg-white'>
            <img 
              src='/images/dji-mini.png'
              className=''
              />
            </a>

            <div className='md:col-start-7 md:col-span-2 md:self-end text-justify md:text-left z-20 '>
              <dl className="md:text-2xl space-y-4 grid grid-cols-2 md:grid-cols-1 my-auto">
                {dronVideo.map((item, i) => (
                  <div
                  key={i}
                  className="items-baseline gap-x-2 "
                  >
                      <dt className="flex-none uppercase font-medium leading-tight">
                        {item.title} 
                      </dt>
                      <dd className="flex-1 basis-[28rem] text-sm md:text-xl md:basis-[36rem] min-w-[16rem] font-light ">
                        {item.desc}
                      </dd>
                  </div>
                ))}
              </dl>
            </div>


            </div>
        </div>

      </div>

    </section>
  )
}

export default Dron