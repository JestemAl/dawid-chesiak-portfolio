import { Clouds, OrbitControls, Scroll, Sky, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import CameraAnimations from './cameraAnimations'

const Experience = () => {



  return <>
    

    <Scroll>
      <mesh position={[]}>
          <boxGeometry args={[2,2,2]} />
          <meshNormalMaterial />
      </mesh>
    </Scroll>


  {/* <OrbitControls /> */}

  </>
}

export default Experience