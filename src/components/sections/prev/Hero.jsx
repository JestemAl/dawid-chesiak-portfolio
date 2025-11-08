import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Hero() {
  const logoRef = useRef(null);
  const dronRef = useRef(null);
  const buttonRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const smoother = ScrollSmoother.create({
        // wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        smoothTouch: 0.1,
        effects: true
      });

      // smoother.effects('.logo-item', {
      //   speed: 1,
      //   lag: (i) => i * 0.1
      // })

      smoother.effects(".img", { speed: 'auto' })

      ScrollTrigger.create({
        trigger: logoRef.current,
        start: "top top",
        end: "+=500",
        pin: true,
        pinType: "transform",        
        pinSpacing: false,
        anticipatePin: 1,
        // markers: true,
        invalidateOnRefresh: true,
      });

      gsap.to(logoRef.current, {
        scale: 0.5,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: logoRef.current,
          start: 'center 20%',
          end: 'top top',
          // markers: true,
          scrub: true,
        }
      })

      gsap.to(buttonRef.current, {
        opacity: 0,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: logoRef.current,
          start: 'center 20%',
          end: 'top top',
          // markers: true,
          scrub: true,
        }
      })

      gsap.to(videoRef.current, {
        scale: 1.2,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: videoRef.current,
          start: 'top 5%',
          endTrigger: '.hero-container',
          end: '+=300',
          scrub: true,
          // markers: true
        }
      })

      ScrollTrigger.create({
        trigger: videoRef.current,
        start: 'top 5%',
        endTrigger: '.panel-section',
        end: 'top top',
        pin: true,
        pinType: "transform",   
        pinSpacing: false,
        pinReparent: true,
        anticipatePin: 1,
        markers: true
      })

      gsap.utils.toArray('.panel').forEach((panel) => {

        // gsap.to(panel, {
        //   rotate:
        // })

        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false
        })
      })



      // po załadowaniu fontów/obrazków:
      window.addEventListener("load", () => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, []);

  return (
    <main id="smooth-wrapper" className="relative w-full bg-gradient-to-b from-[#c8e5fc] via-[#ffffff] via-15% to-[#ffffff]">
      <div id="smooth-content" className="h-auto flex flex-col justify-center">

        <div className="hero-container h-[200svh] flex flex-col justify-center">
          <header className="h-[100svh] absolute inset-x-0 top-[0svh] flex flex-col justify-top items-center gap-4 ">
            <img ref={dronRef} src='images/dron.png' className="logo-item w-32" />

            <div ref={logoRef} className="logo-item text-center">
              <h2 className="pinyon-script-regular leading-[0.5] z-10 text-[#ff2946] text-4xl">Dawid</h2>
              <h1 className="orbitron uppercase leading-[0.8] font-extrabold text-4xl text-center text-[#333]">Drone <br/> Operator</h1>
            </div>

            <div ref={buttonRef} className="logo-item bg-neutral-800 rounded-full px-4 py-2 w-64 text-white text-center"> Napisz do mnie! </div>
          </header>

          <div ref={videoRef} className='h-[90svh] md:h-[50svh]  px-4 rounded-2xl'> 
            <video 
                src='videos/rolka.mov' 
                autoPlay 
                loop
                muted 
                 
                className='object-cover h-full rounded-2xl' 
                /> 
          </div> 

        </div>


        <section className="panel-section relative w-full">
          <div className="panel h-[100svh] flex items-center justify-center bg-red-300">
            <p className="text-4xl">2</p>
          </div>
        </section>

        <section className="relative">
          
          <div className="images h-[500vh] bg-neutral-950 mt-64">
            <div className="img-container h-[80vh] max-w-[500px] mx-auto ">
              <img src="/photos/fota1-drift.jpg" className="img" data-speed />
            </div>
                        {/* <div className="img-container h-[80vh] max-w-[500px] top-52 mx-auto ">
              <img src="/photos/fota1-drift.jpg" className="img" data-speed />
            </div>
                        <div className="img-container h-[80vh] max-w-[500px] top-52 mx-auto ">
              <img src="/photos/fota1-drift.jpg" className="img" data-speed />
            </div>
                        <div className="img-container h-[80vh] max-w-[500px] top-52 mx-auto ">
              <img src="/photos/fota1-drift.jpg" className="img" data-speed="auto" />
            </div> */}


            
          </div>
        </section>

      </div>
    </main>
  );
}
