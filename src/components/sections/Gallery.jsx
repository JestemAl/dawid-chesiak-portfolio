import React from "react";
import GalleryDesktop from "./gallery/GalleryDesktop";
import GalleryMobile from "./gallery/GalleryMobile";

export default function Gallery() {
  return (
    <>
      <div className="hidden h-[30vh] md:block" />
      {/* mobile: pin sekcji drona "trzyma" ~2 ekrany scrolla – ten odstęp go
          kompensuje; bez niego galeria przejeżdża schowana pod przypiętym dronem */}
      <div className="h-[140vh] md:hidden" />
      <div id="realizacje">
        <div className="hidden md:block">
          <GalleryDesktop />
        </div>

        <div className="md:hidden">
          <GalleryMobile />
        </div>
      </div>
    </>
  );
}
