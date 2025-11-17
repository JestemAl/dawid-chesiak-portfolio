
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Dawid from "./components/sections/AboutMe/Dawid";
import Gallery from "./components/sections/Gallery";
import Footer from "./components/sections/Footer";
import Dron from "./components/sections/AboutMe/Dron";
import AboutMe from "./components/sections/AboutMe";


gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

function App() {

  useGSAP(() => {
    let smoother = ScrollSmoother.create({
      wrapper: '#wrapper',
      content: '#content',
      smooth: 2,
      smoothTouch: 0.1,
      effects: true
    })

     gsap.set(".title", { x: -100, autoAlpha: 0 });
     gsap.utils.toArray(".title").forEach((title) => {
        gsap.to(title, {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: title,
            start: "top bottom",
          },
        });
      })
      

    smoother.effects('.gallery-content img', { speed: "auto" })
  })

  return (
    <>
      <main id="wrapper">
        <div id="content">
          {/* <Nav /> */}
          <Hero />
          <About />
          <AboutMe />
          <Gallery />
          <Footer />
        </div>
      </main>
    </>
  )
}

export default App
