import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Gallery() {
  useLayoutEffect(() => {
    let smoother = ScrollSmoother.create({
        wrapper: "#root",  
        content: "#content",
        smooth: 3,
        effects: true,
      });

      smoother.effects("#content img", { speed: "auto" });
  }, []);

  return (
    <section id="content">
      <div className="spacer" />

      <section className="image-grid container">
        <div className="image_cont"><img src="/photos/fota1.jpg" alt="" /></div>
        <div className="image_cont"><img src="/photos/fota2.jpg" alt="" /></div>
        <div className="image_cont"><img src="/photos/fota3.jpg" alt="" /></div>
        <div className="image_cont"><img src="/photos/fota4.jpg" alt="" /></div>
        <div className="image_cont"><img src="/photos/fota5.jpg" alt="" /></div>
        <div className="image_cont"><img src="/photos/fota6.jpg" alt="" /></div>
      </section>
      <div className="spacer" />
    </section>
  );
}
