import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const container = useRef(null);
  const videoRef = useRef(null);

// useEffect(() => {
//   const context = gsap.context(() => {
//     gsap.to(videoRef.current, {
//       scale: 1.4,
//       transformOrigin: "center center",
//       ease: "none",
//       // ease: "power1.inOut",
//       scrollTrigger: {
//         trigger: videoRef.current,
//         start: "top top",
//         markers: true,
//         endTrigger: container.current,
//         end: "bottom bottom",
//         // anticipatePin: 1,  
//         scrub: true
//       },
//     })
//   }, container.current)
//   return () => context.revert()
// }, [])


  return (
    <section 
            ref={container} 
            className='relative w-full h-[200vh] bg-gradient-to-b from-[#c8e5fc] via-[#ffffff] via-15% to-[#ffffff]'
        > 
        <img 
          src='images/dron.png'
          className='absolute top-[-10] left-0 w-36'
        />

        {/* <div className='absolute top-0 h-[100vh] '>  */}
          <div className='sticky top-0 overflow-hidden '>
            <header className='flex flex-col items-center mx-auto pt-24 px-4'>
                <h2 className='pinyon-script-regular  leading-[0.5] z-10 text-[#ff2946] text-4xl '>Dawid</h2>
                <h1 className='orbitron uppercase leading-[0.8] font-extrabold text-4xl text-center text-[#333]'>Drone Operator</h1>
                <p className='text-sm font-light text-center pt-4  text-neutral-800'>
                  Jestem Dawi, zajmuję się fotografią oraz filmowaniem z drona. Dzialam w Bydgoszczy i okolicach.            </p>
                <div className='font-light bg-neutral-700 text-white w-64 text-center px-4 py-2 mt-10 mb-6 rounded-full'>
                  Napisz do mnie!
                </div>
            </header>
          </div>            
          <div className='sticky top-0 origin-top z-10 '> 
            <div className='relative overflow-hidden pt-8 '>

              <div ref={videoRef} className='h-[94vh] md:h-[50vh] mx-auto px-4 '> 
                <video 
                    src='videos/rolka.mov' 
                    autoPlay 
                    loop
                    muted 
                    playsInline 
                    className='object-cover h-full rounded-2xl ' 
                    /> 
              </div> 
            </div>
          </div> 
          {/* </div> */}
    </section>
  );
};

export default Hero;
