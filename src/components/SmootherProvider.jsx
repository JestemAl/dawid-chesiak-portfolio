import { useGSAP } from '@gsap/react'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { createContext, useContext, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother) 

const SmootherContext = createContext(null)

export const useSmoother = () => useContext(SmootherContext)

export default SmootherProvider({children})
{
    const wrapperRef = useRef(null)
    const contentRef = useRef(null)

    useGSAP(() => {
        ScrollSmoother.create({
            wrapper: wrapperRef.current,
            content: contentRef.current,
            smooth: 2,
            smoothTouch: 0.1,
            effects: true
        })
    })
    

  return (
    <div>Smoother</div>
  )
}
