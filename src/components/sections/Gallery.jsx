import React from 'react'

const Gallery = () => {
  return (
    <section className='gallery-content bg-neutral-950'>
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