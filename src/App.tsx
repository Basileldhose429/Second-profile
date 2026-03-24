/**
 * App.tsx
 * Root component that mounts:
 *  - The Three.js Canvas (with shadow map)
 *  - HTML UI overlay (LoadingScreen, HUD, Instructions, etc.)
 *  - KeyboardControls for WASD / Space
 *  - Background music (HTML audio, not WebAudio for compatibility)
 */
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, useProgress } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import Experience from './components/Experience'
import LoadingScreen from './components/ui/LoadingScreen'
import HUD from './components/ui/HUD'
import Instructions from './components/ui/Instructions'
import AchievementToast from './components/ui/AchievementToast'
import SectionModal from './components/ui/SectionModal'
import { useGameStore } from './store/useGameStore'

/* Keyboard map */
const KEYS = [
  { name: 'forward',  keys: ['ArrowUp',    'KeyW'] },
  { name: 'backward', keys: ['ArrowDown',  'KeyS'] },
  { name: 'left',     keys: ['ArrowLeft',  'KeyA'] },
  { name: 'right',    keys: ['ArrowRight', 'KeyD'] },
  { name: 'brake',    keys: ['Space'] },
]

/* Inner component to handle loading state transition */
function SceneLoader() {
  const { active, progress } = useProgress()
  const { setLoaded, loaded } = useGameStore()

  useEffect(() => {
    if (!active && progress === 100 && !loaded) {
      // Small delay so GSAP fade has time
      setTimeout(() => setLoaded(true), 1700)
    }
  }, [active, progress, loaded, setLoaded])

  return null
}

export default function App() {
  const { musicEnabled } = useGameStore()
  const audioRef = useRef<HTMLAudioElement>(null)

  // Toggle background music
  useEffect(() => {
    if (!audioRef.current) return
    if (musicEnabled) {
      audioRef.current.play().catch(() => {/* autoplay blocked */})
    } else {
      audioRef.current.pause()
    }
  }, [musicEnabled])

  return (
    <KeyboardControls map={KEYS}>
      {/* Background music (looping ambient) */}
      <audio ref={audioRef} loop preload="none">
        {/* Free royalty-free ambient loop from pixabay (replace with your own) */}
        <source src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6febc81.mp3" type="audio/mpeg" />
      </audio>

      {/* THREE.js Canvas */}
      <Canvas
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 8, 14], fov: 55, near: 0.1, far: 200 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#080818']} />
        <Suspense fallback={null}>
          <Experience />
          <SceneLoader />
        </Suspense>
      </Canvas>

      {/* HTML UI Overlay */}
      <LoadingScreen />
      <HUD />
      <Instructions />
      <AchievementToast />
      <SectionModal />
    </KeyboardControls>
  )
}
