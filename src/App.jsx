
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Gallery from "./components/sections/Gallery";
// import Showreel from "./components/sections/Showreel"; // schowany – wraca, gdy będą klipy
import Footer from "./components/sections/Footer";
import AboutMe from "./components/sections/AboutMe";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

function App() {

  useGSAP(() => {
    // Defer ScrollSmoother + ScrollTrigger setup do następnej klatki – pozwala browserowi
    // wyrenderować pierwszą klatkę (LCP) zanim GSAP zacznie modyfikować layout
    const id = requestAnimationFrame(() => {
      const smoother = ScrollSmoother.create({
        wrapper: '#wrapper',
        content: '#content',
        smooth: 2,
        smoothTouch: 0.1,
        effects: true
      })

      const mm = gsap.matchMedia()
      mm.add("(min-width: 779px)", () => {
        gsap.utils.toArray(".title").forEach((title) => {
          gsap.from(title, {
            autoAlpha: 0,
            duration: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: title,
              start: "top bottom",
            },
          });
        })

        // parallax dotyczy galerii desktopowej – na mobile jest ukryta (display:none),
        // więc tworzenie tam 8 ScrollTriggerów to czysty koszt startu
        smoother.effects('.gallery-content img', { speed: "auto" })
      })
    })

    return () => cancelAnimationFrame(id)
  })

  return (
    <>
      <main id="wrapper">
        <div id="content">
          <Hero />
          <About />
          <AboutMe />
          <Gallery />
          {/* <Showreel /> */}
          <Footer />
        </div>
      </main>
    </>
  )
}

export default App
