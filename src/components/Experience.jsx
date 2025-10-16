import { Clouds, OrbitControls, Scroll, Sky, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import CameraAnimations from './cameraAnimations'

const Experience = () => {



  return <>
    <Sky />
    <Clouds />
    <CameraAnimations />

    <axesHelper args={[5]} />
    <gridHelper args={[10, 10]} />
    
    <mesh>
        <boxGeometry args={[2,2,2]} />
        <meshNormalMaterial />
    </mesh>

    <mesh position={[0, 0 ,20]}>
        <boxGeometry args={[2,2,2]} />
        <meshNormalMaterial />
    </mesh>

  {/* <OrbitControls /> */}

  </>
}

export default Experience