/**
 * Particles.tsx
 * Floating ambient particles in the 3D world.
 * Uses instanced and optimised Points for performance.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 300

export default function AmbientParticles() {
  const meshRef = useRef<THREE.Points>(null!)

  const [positions, speeds] = useMemo(() => {
    const pos   = new Float32Array(COUNT * 3)
    const spd   = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = Math.random() * 10 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
      spd[i]         = 0.02 + Math.random() * 0.05
    }
    return [pos, spd]
  }, [])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    const posArr = (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      posArr[i * 3 + 1] += speeds[i] * delta * 10
      if (posArr[i * 3 + 1] > 12) posArr[i * 3 + 1] = 0.5
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#818cf8"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
