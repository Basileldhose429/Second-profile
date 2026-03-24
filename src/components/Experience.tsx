/**
 * Experience.tsx
 * The Three.js scene root — loaded inside <Suspense>.
 * Contains: lighting, environment, physics world, player, environment objects, effects.
 */
import { Suspense } from 'react'
import { Environment } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Player from './player/Player'
import WorldEnvironment from './world/WorldEnvironment'
import AmbientParticles from './effects/Particles'
import PostProcessing from './effects/PostProcessing'

export default function Experience() {
  return (
    <>
      {/* ── Lighting ── */}
      {/* Soft directional sunlight */}
      <directionalLight
        castShadow
        position={[15, 25, 15]}
        intensity={2.5}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-bias={-0.001}
      />
      {/* Cool ambient fill */}
      <ambientLight intensity={0.4} color="#c7d2fe" />
      {/* Rim light from behind */}
      <directionalLight position={[-10, 10, -10]} intensity={0.6} color="#818cf8" />

      {/* ── HDR Environment ── */}
      <Environment preset="city" />

      {/* ── Fog for depth ── */}
      <fog attach="fog" args={['#0a0a18', 30, 80]} />

      {/* ── Physics World ── */}
      <Physics gravity={[0, -20, 0]}>
        {/* Suspend heavy geometry loading */}
        <Suspense fallback={null}>
          <WorldEnvironment />
          <Player />
        </Suspense>
      </Physics>

      {/* ── Ambient particles (outside physics) ── */}
      <AmbientParticles />

      {/* ── Post-processing ── */}
      <PostProcessing />
    </>
  )
}
