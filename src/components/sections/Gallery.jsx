import React from "react";
import GalleryDesktop from "./gallery/GalleryDesktop";
import GalleryMobile from "./gallery/GalleryMobile";

export default function Gallery() {
  return (
    <>
      <div className="spacer md:hidden" />


      <div className="spacer" />
      <div className="hidden md:block">
        <GalleryDesktop />
      </div>

      <div className="md:hidden">
        <GalleryMobile />
      </div>
    </>
  );
}
