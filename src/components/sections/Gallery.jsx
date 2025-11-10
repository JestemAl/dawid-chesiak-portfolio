import React from 'react'

const Gallery = () => {
  return (
    <section className='gallery-content bg-neutral-950'>

        {/* <div className='title flex flex-col gap-6 p-6 md:p-12 xl:px-16 xl:py-12 text-white'>
          <div className='w-full flex justify-between md:justify-start md:space-x-4 font-light text-sm md:text-xl xl:text-3xl md:font-light'>
            <div className='md:'>03</div>
            <div className='' >Moje realizacje</div>
          </div>

          <div className='flex flex-col max-w-3xl w-full'>
            <h2 className='text-4xl md:text-6xl lg:text-8xl uppercase'></h2>
          </div>
        </div> */}

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
  )
}

export default Gallery