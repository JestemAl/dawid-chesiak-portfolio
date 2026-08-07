import React from 'react'
import { galleryPhotos } from '../../../constants'

const Gallery = () => {
  return (
    <section className='gallery-content bg-neutral-950'>
        <div className='title  top-0 flex flex-col items-center justify-center h-[100svh]  text-white'>

            <h2 className='text-4xl md:text-6xl lg:text-8xl uppercase'>
              Moje Realizacje!
            </h2>

        </div>

      <div className="spacer" />
      {/* <div className="spacer md:hidden" /> */}

      
<section className="image-grid container">
  {galleryPhotos.map(({ id, alt }) => (
    <div className="image_cont" key={id}>
      <img
        decoding="async"
        loading="lazy"
        src={`/photos/fota${id}-800.webp`}
        srcSet={`/photos/fota${id}-800.webp 800w, /photos/fota${id}-1600.webp 1600w`}
        sizes="(min-width: 1024px) 33vw, 50vw"
        width="800"
        height="450"
        alt={alt}
      />
    </div>
  ))}
</section>

      
      <div className="spacer" />
    </section>
  )
}

export default Gallery