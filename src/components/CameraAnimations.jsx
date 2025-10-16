// CameraAnimations.simple.jsx
import { useMemo, useRef, useLayoutEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from './store/useAppStore'

const clamp01 = v => Math.min(1, Math.max(0, v))
const invLerp = (a,b,x) => clamp01((x-a)/(b-a))
const easeInOut = t => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(t))

// helper: lerp trzech składowych wektorów
function lerpVec(out, a, b, t) {
  out.set(
    THREE.MathUtils.lerp(a.x, b.x, t),
    THREE.MathUtils.lerp(a.y, b.y, t),
    THREE.MathUtils.lerp(a.z, b.z, t),
  )
  return out
}

function toVec3(src, tmp = new THREE.Vector3()) {
  if (!src) return tmp.set(0,0,0)
  if (Array.isArray(src)) return tmp.set(src[0], src[1], src[2])
  if ('isObject3D' in src) return tmp.copy(src.position)
  // domyślnie (x,y,z) z obiektu
  return tmp.set(src.x ?? 0, src.y ?? 0, src.z ?? 0)
}

export default function CameraAnimations({ models = [] /* np. [ref1, ref2, ...] */ }) {
  const { camera } = useThree()
  const scroll = useScroll()
  const get = useAppStore.getState

  // „stan wewnętrzny” riga
  const positionGoal = useRef(new THREE.Vector3())       // cel pozycji
  const targetGoal = useRef(new THREE.Vector3())      // cel targetu
  const lookSmoothed = useRef(new THREE.Vector3())  // wygładzany target
  const tmpA = useRef(new THREE.Vector3()).current
  const tmpB = useRef(new THREE.Vector3()).current

  // mapowanie rozdziałów (łatwo zmienisz granice)
  const chapters = useMemo(() => {
    const P = scroll.pages || 10
    const p = (pg) => (pg - 1) / P
    return [
      { name: 'A', range: [p(1), p(2)] },  // 1–3
      { name: 'B', range: [p(2), p(4)] },  // 3–5
      { name: 'C', range: [p(4), p(7)] },  // 5–7
      { name: 'D', range: [p(7), p(9)] },  // 7–9
      { name: 'E', range: [p(9), 1.0] },   // 9–10
    ]
  }, [scroll.pages])

  // start pewny
  useLayoutEffect(() => {
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)
    positionGoal.current.set(0, 0, 6)
    targetGoal.current.set(0, 0, 0)
    lookSmoothed.current.set(0, 0, 0)
  }, [camera])

  // ——— API do użycia w switch ———
  // moveTo: podaj startPos, endPos (tablica [x,y,z] lub Vector3) i t
  const moveTo = (startPos, endPos, t) => {
    const a = toVec3(startPos, tmpA)
    const b = toVec3(endPos,   tmpB)
    lerpVec(positionGoal.current, a, b, t)
  }
  // lookAt: podaj startTarget, endTarget (mogą być [x,y,z] ALBO ref modelu) i t
  const lookAt = (startTarget, endTarget, t) => {
    const a = toVec3(
      typeof startTarget === 'number' ? models[startTarget]?.current : startTarget,
      tmpA
    )
    const b = toVec3(
      typeof endTarget === 'number' ? models[endTarget]?.current : endTarget,
      tmpB
    )
    lerpVec(targetGoal.current, a, b, t)
  }
  // lookAtModel: skrót gdy chcesz patrzeć na konkretny model (indeks lub ref)
  const lookAtModel = (model, offset = [0,0,0]) => {
    const o = Array.isArray(model) || (model?.isObject3D) ? model : models[model]?.current
    const base = toVec3(o, tmpA)
    targetGoal.current.set(base.x + offset[0], base.y + offset[1], base.z + offset[2])
  }

  const position = {
    A: [0, 0, 6],
    B: [0, 16, 16],
    C: [5, 30, 16],
    D: [0, 30, 16],
    E: [0, 25, 20],
    F: [0, 10, 20],
  }

    const targetPosition = {
    A: [0, 0, 0],
    B: [5, 30, 10],
    C: [5, 30, 15],
    D: [5, 30, 20],
    E: [0, 0, 20],
  }


  useFrame((_, dt) => {
    const off = clamp01(get().offset)

    // 1) aktywny rozdział + lokalny t
    let active = chapters[chapters.length - 1]
    for (let i = 0; i < chapters.length; i++) {
      const [a, b] = chapters[i].range
      const rightExclusive = i < chapters.length - 1
      const inRange = rightExclusive ? off >= a && off < b : off >= a && off <= b
      if (inRange) { active = chapters[i]; break }
    }
    const [a, b] = active.range
    const t = easeInOut(invLerp(a, b, off))

    // 2) TYLKO TU wpisujesz liczby / modele — cała reszta jest ogólna
    switch (active.name) {
      case 'A': { // przykład: start [0,0,6] → [0,14,18], patrz stopniowo w dół
        moveTo(position.A, position.B, t)
        lookAt(targetPosition.A, targetPosition.A, t)
        break
      }
      case 'B': { // lecimy w stronę Modelu 0 i coraz bardziej patrzymy na Model 0
        moveTo(position.B, position.C, t)     // podmień liczby jak chcesz
        lookAt(targetPosition.A, targetPosition.B, t)
        break
      }
      case 'C': { // pauza w stałym punkcie i patrzymy na Model 1 (bez lerpa targetu)
        moveTo(position.C, position.D, t)     // stała pozycja
        lookAt(targetPosition.B, targetPosition.C, t)         // patrz na models[1]
        break
      }
      case 'D': { // przelot do innej pozycji, patrz z dryfem między modelami 1→2
        moveTo(position.D, position.E, t)
        lookAt(targetPosition.C, targetPosition.D, t)
        break
      }
      case 'E': { // finał: zbliżenie i delikatny tilt na dół
        moveTo(position.E, position.F, t)
        lookAt(targetPosition.D, targetPosition.E, t)
        break
      }
    }

    

    // 3) wygładzenie pozycji i targetu (żeby nie „teleportowały”)
    const λPos = 4, λTarget = 6
    camera.position.x = THREE.MathUtils.damp(camera.position.x, positionGoal.current.x, λPos, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, positionGoal.current.y, λPos, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, positionGoal.current.z, λPos, dt)

    lookSmoothed.current.x = THREE.MathUtils.damp(lookSmoothed.current.x, targetGoal.current.x, λTarget, dt)
    lookSmoothed.current.y = THREE.MathUtils.damp(lookSmoothed.current.y, targetGoal.current.y, λTarget, dt)
    lookSmoothed.current.z = THREE.MathUtils.damp(lookSmoothed.current.z, targetGoal.current.z, λTarget, dt)

    // (bezpiecznik) nie pozwól, by target był identyczny z pozycją kamery
    if (camera.position.distanceTo(lookSmoothed.current) < 1e-4) {
      lookSmoothed.current.z -= 1e-3
    }
    camera.lookAt(lookSmoothed.current)
  })

  return null
}
