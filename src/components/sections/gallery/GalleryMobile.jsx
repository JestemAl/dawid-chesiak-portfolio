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
                alt={`Lotnicze zdjęcie z drona – realizacja ${i + 1}`}
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
