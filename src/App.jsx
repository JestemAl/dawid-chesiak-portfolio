
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Gallery from "./components/sections/Gallery";


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

    smoother.effects('.gallery-content img', { speed: "auto" })
  })

  return (
    <>
      <main id="wrapper">
        <div id="content">
          <Hero />
          <About />
          {/* <Gallery /> */}
        </div>
      </main>
    </>
  )
}

export default App
