import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import { ScrollControls } from "@react-three/drei"
import ScrollManager from "./components/ScrollManager"
import { useState } from "react"


function App() {

  return (
    <>

        <Canvas
          dpr={[1, 2]}
          camera={{
            position: [0, 0, 6],
            fov: 45
          }}
          >
          <color attach='background' args={['#333']} />

          <ScrollControls
            infinite={ false }
            pages={ 10 }
            damping={false}
          >
            <ScrollManager />


            <Experience />
            
          </ScrollControls>

        </Canvas>
    </>
  )
}

export default App
