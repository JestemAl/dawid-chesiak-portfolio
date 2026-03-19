import React from 'react'

const Gallery = () => {
  return (
    <section className='gallery-content bg-neutral-950'>
      <div className="spacer md:hidden" />


        <div className='title  top-0 flex flex-col items-center justify-center h-[100svh]  text-white'>

            <h2 className='text-4xl md:text-6xl lg:text-8xl uppercase'>
              Moje Realizacje!
            </h2>

        </div>

      <div className="spacer" />
      {/* <div className="spacer md:hidden" /> */}

      
<section className="image-grid container">
  <div className="image_cont"><img loading="eager" src="/photos/fota1.webp" alt="Lotnicze zdjęcie z drona – realizacja 1" /></div>
  <div className="image_cont"><img loading="eager" src="/photos/fota3.webp" alt="Lotnicze zdjęcie z drona – realizacja 2" /></div>
  <div className="image_cont"><img loading="eager" src="/photos/fota4.webp" alt="Lotnicze zdjęcie z drona – realizacja 3" /></div>
  <div className="image_cont"><img loading="lazy" src="/photos/fota5.webp" alt="Lotnicze zdjęcie z drona – realizacja 4" /></div>
  <div className="image_cont"><img loading="lazy" src="/photos/fota6.webp" alt="Lotnicze zdjęcie z drona – realizacja 5" /></div>
  <div className="image_cont"><img loading="lazy" src="/photos/fota7.webp" alt="Lotnicze zdjęcie z drona – realizacja 6" /></div>
  <div className="image_cont"><img loading="lazy" src="/photos/fota8.webp" alt="Lotnicze zdjęcie z drona – realizacja 7" /></div>
  <div className="image_cont"><img loading="lazy" src="/photos/fota9.webp" alt="Lotnicze zdjęcie z drona – realizacja 8" /></div>
</section>

      
      <div className="spacer" />
    </section>
  )
}

export default Gallery