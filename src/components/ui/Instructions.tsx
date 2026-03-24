/**
 * Instructions.tsx
 * Fullscreen instructions popup shown on first load and via "?" button.
 * Uses GSAP for entry animation.
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGameStore } from '../../store/useGameStore'

const CONTROLS = [
  { keys: ['W', 'A', 'S', 'D'], action: 'Drive / Steer' },
  { keys: ['↑', '↓', '←', '→'], action: 'Alternative Drive' },
  { keys: ['Space'], action: 'Brake' },
  { keys: ['E'], action: 'Interact with zone' },
  { keys: ['Mouse'], action: 'Rotate camera' },
]

export default function Instructions() {
  const { showInstructions, setShowInstructions, loaded } = useGameStore()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showInstructions && panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' })
    }
  }, [showInstructions])

  if (!loaded || !showInstructions) return null

  const close = () => {
    gsap.to(panelRef.current, {
      opacity: 0, scale: 0.9, y: 20, duration: 0.4, ease: 'power2.in',
      onComplete: () => setShowInstructions(false),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        className="bg-[#0d0d1a] border border-indigo-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-indigo-900/30"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-black text-2xl tracking-wide">
            HOW TO <span className="text-indigo-400">PLAY</span>
          </h2>
          <button
            onClick={close}
            className="text-white/40 hover:text-white text-2xl transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {CONTROLS.map(({ keys, action }) => (
            <div key={action} className="flex items-center justify-between">
              <span className="text-white/60 text-sm">{action}</span>
              <div className="flex gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-white font-mono">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
          <p className="text-indigo-300 text-sm">
            🗺️ Drive around the world and explore the 4 zones:
            Projects, About, Skills, and Contact.
            Hunt for 🥚 <strong>3 hidden easter eggs</strong>!
          </p>
        </div>

        <button
          onClick={close}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Let's Go! 🚀
        </button>
      </div>
    </div>
  )
}
