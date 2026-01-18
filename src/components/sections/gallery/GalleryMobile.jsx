import React, { useEffect, useRef } from "react";

const photos = [
  "/photos/fota1.webp",
  "/photos/fota3.webp",
  "/photos/fota4.webp",
  "/photos/fota5.webp",
  "/photos/fota6.webp",
  "/photos/fota7.webp",
  "/photos/fota8.webp",
  "/photos/fota9.webp",
];

export default function GalleryMobile() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      Array.from(el.children).forEach((child) => {
        const center = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(center - mid);
        const t = Math.min(1, dist / 400);
        const scale = 1 - t * 0.12; // 1.0 -> 0.88
        child.style.transform = `scale(${scale})`;
      });
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-neutral-950 text-white">
      <div className="px-4 pt-10 pb-6">
        <h2 className="text-3xl uppercase">Galeria</h2>
      </div>

      <div className="pb-12">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 [-webkit-overflow-scrolling:touch]"
        >
          {photos.map((src, i) => (
            <div
              key={src}
              className="snap-center shrink-0 w-[78vw] h-[64svh]  overflow-hidden bg-black transition-transform duration-150"
            >
              <img
                src={src}
                alt=""
                loading={i < 2 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// import React, { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// const photos = [
//   "/photos/fota1.webp",
//   "/photos/fota3.webp",
//   "/photos/fota4.webp",
//   "/photos/fota5.webp",
//   "/photos/fota6.webp",
//   "/photos/fota7.webp",
//   "/photos/fota8.webp",
//   "/photos/fota9.webp",
// ];

// export default function GalleryMobileCardsFling() {
//   const sectionRef = useRef(null);

//   useGSAP(() => {
//     const mm = gsap.matchMedia();

//     mm.add("(max-width: 767px)", () => {
//       const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//       if (reduce) return;

//       const cards = gsap.utils.toArray(".gm-card");

//       // Start: talia lekko "rozsypana"
//       cards.forEach((card, i) => {
//         gsap.set(card, {
//           rotate: (i % 2 ? 1 : -1) * (3 + i * 0.35),
//           y: i * 2,
//           scale: 1 - i * 0.01,
//           transformOrigin: "50% 80%",
//           willChange: "transform",
//         });
//       });

//       // Timeline: jedna karta po drugiej "wylatuje"
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top top",
//           end: `+=${cards.length * 110}%`, // długość scrolla (dopasuj)
//           scrub: true,
//           pin: true,
//           anticipatePin: 1,
//         },
//       });

//       cards.forEach((card, i) => {
//         // nie wyrzucamy ostatniej (żeby zostało "ostatnie zdjęcie" na koniec)
//         if (i === cards.length - 1) return;

//         const dir = i % 2 === 0 ? 1 : -1;

//         tl.to(card, {
//           // "wyrzut" karty
//           xPercent: 120 * dir,
//           yPercent: -20,
//           rotate: 28 * dir,
//           scale: 0.95,
//           autoAlpha: 0,
//           ease: "none",
//           duration: 1,
//         }, i); // każde na kolejnej "sekcji" timeline
//       });
      
//       return () => ScrollTrigger.refresh();
//     });

//     return () => mm.revert();
//   }, { scope: sectionRef });

//   return (
//     <section ref={sectionRef} className="bg-neutral-950 text-white">
//       {/* tytuł */}
//       <div className="h-[35svh] flex items-center justify-center px-6">
//         <h2 className="text-4xl uppercase text-center leading-tight">
//           Moje Realizacje!
//         </h2>
//       </div>

//       {/* scena: sticky/pin robimy GSAPem, więc tutaj tylko stage */}
//       <div className="relative h-[100svh] flex items-center justify-center px-4">
//         <div className="relative w-full max-w-[520px] h-[74svh]">
//           {photos.map((src, i) => (
//             <div
//               key={src}
//               className="gm-card absolute inset-0 rounded-3xl overflow-hidden bg-black shadow-2xl"
//               style={{ zIndex: photos.length - i }}
//             >
//               <img
//                 src={src}
//                 alt=""
//                 loading={i < 2 ? "eager" : "lazy"}
//                 className="w-full h-full object-cover" // kino w feedzie
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
