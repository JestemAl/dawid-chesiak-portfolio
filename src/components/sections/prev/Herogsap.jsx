import React, { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion';

const Hero = () => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // skala wideo
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 2]);

  return (
    <section 
            ref={container} 
            className='relative w-full h-[200vh]'
        > 
        <div className='sticky top-0 h-screen overflow-hidden'> 
            <header className='flex flex-col items-center mx-auto mt-12 px-4'>
                <h2 className='text-5xl '>Dawid</h2>
                <h1 className='uppercase leading-[0.9] font-extrabold text-5xl text-center'>Drone Operator</h1>
                <p className='text-sm font-light text-justify mt-4'>dustry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not onl</p>
            </header>
            <motion.div 
                style={{ scale: scale4 }}
                className='absolute bottom-0 h-full w-full flex items-end origin-bottom'
            > 
            <div className='relative h-[55h] px-4'> 
                <video 
                    src='videos/rolka.mov' 
                    autoPlay 
                    loop
                    muted 
                    playsInline 
                    className='object-cover h-full rounded-2xl ' 
                /> 
            </div> 
            </motion.div> 
        </div> 
    </section>
  );
};

export default Hero;
