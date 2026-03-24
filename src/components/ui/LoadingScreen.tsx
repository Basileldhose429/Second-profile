/**
 * LoadingScreen.tsx
 * Displays a cinematic loading screen with progress bar using R3F useProgress.
 * Fades out when assets are fully loaded.
 */
import { useProgress } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGameStore } from '../../store/useGameStore'

export default function LoadingScreen() {
  const { active, progress } = useProgress()
  const { loaded, setLoaded } = useGameStore()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // When all assets loaded and not active, transition out
    if (!active && progress === 100 && !loaded) {
      const tl = gsap.timeline({
        onComplete: () => setLoaded(true),
      })
      tl.to(wrapperRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        delay: 0.5,
      })
    }
  }, [active, progress, loaded, setLoaded])

  if (loaded) return null

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080818]"
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(79,70,229,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Logo / Title */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-6xl font-black tracking-widest text-white mb-2">
          BASIL<span className="text-indigo-400">.</span>DEV
        </h1>
        <p className="text-indigo-300/60 tracking-[0.5em] text-sm uppercase">
          Portfolio Experience
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-72">
        <div className="flex justify-between text-xs text-indigo-300/70 mb-2">
          <span>Loading world...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Hint */}
      <p className="relative z-10 mt-12 text-white/20 text-xs tracking-widest uppercase">
        Use WASD to drive
      </p>
    </div>
  )
}
