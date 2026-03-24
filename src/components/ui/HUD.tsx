/**
 * HUD.tsx
 * In-game heads-up display overlay.
 * Shows: instructions button, mute toggle, section name, easter egg counter.
 */
import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/useGameStore'

const SECTION_LABELS: Record<string, string> = {
  projects: '🏗️ Projects Zone',
  about: '📌 About Me',
  skills: '⚡ Skills Arena',
  contact: '📬 Contact Station',
}

export default function HUD() {
  const {
    loaded,
    musicEnabled, toggleMusic,
    activeSection,
    setShowInstructions,
    easterEggsFound,
    earnedAchievements,
  } = useGameStore()

  const [sectionLabel, setSectionLabel] = useState('')

  useEffect(() => {
    if (activeSection !== 'none') {
      setSectionLabel(SECTION_LABELS[activeSection] || '')
    } else {
      setSectionLabel('')
    }
  }, [activeSection])

  if (!loaded) return null

  return (
    <>
      {/* Top-left: Game title */}
      <div className="fixed top-5 left-5 z-40">
        <h1 className="text-white font-black text-xl tracking-widest">
          BASIL<span className="text-indigo-400">.</span>DEV
        </h1>
        <p className="text-white/30 text-[10px] tracking-wider uppercase">
          Interactive Portfolio
        </p>
      </div>

      {/* Top-right: Controls */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-3">
        {/* Easter Egg counter */}
        {easterEggsFound > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/60 border border-white/10">
            🥚 {easterEggsFound}/3
          </div>
        )}
        {/* Achievements badge */}
        {earnedAchievements.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/60 border border-white/10">
            🏆 {earnedAchievements.length}
          </div>
        )}
        {/* Music toggle */}
        <button
          onClick={toggleMusic}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
          title={musicEnabled ? 'Mute Music' : 'Play Music'}
        >
          {musicEnabled ? '🔊' : '🔇'}
        </button>
        {/* Instructions */}
        <button
          onClick={() => setShowInstructions(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
          title="Controls"
        >
          ?
        </button>
      </div>

      {/* Bottom-center: Active section label */}
      {sectionLabel && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full text-sm font-medium tracking-wide animate-pulse">
            {sectionLabel} — Press <kbd className="bg-white/20 rounded px-1 text-xs">E</kbd> to explore
          </div>
        </div>
      )}
    </>
  )
}
