import { useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useAppStore } from "./store/useAppStore"

const ScrollManager = () => {
  const data = useScroll()
  const last = useRef(1)
  const setOffset = useAppStore(state => state.setOffset)
  const setCurrentSection = useAppStore(state => state.setCurrentSection)



  useFrame(() => {
    const t = Math.min(Math.max(data.scroll.current, 0), 0.999999)   // zakres [0, 1]
    setOffset(t)
    
    
    const next = Math.floor(t * data.pages) + 1                     // zakres [1, 10]

    if (next !== last.current) {
      last.current = next
      setCurrentSection(next)
    }
  })

  return null
}


export default ScrollManager