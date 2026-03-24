/**
 * AchievementToast.tsx
 * Shows a sliding toast notification when the player earns an achievement.
 * Uses CSS keyframe animations (achievement-in / achievement-out).
 */
import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

interface Toast {
  id: string
  title: string
  description: string
}

export default function AchievementToast() {
  const { earnedAchievements, achievements } = useGameStore()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [prev, setPrev] = useState<string[]>([])

  useEffect(() => {
    // Detect newly unlocked achievements
    const newOnes = earnedAchievements.filter((id) => !prev.includes(id))
    if (newOnes.length === 0) return

    const newToasts = newOnes
      .map((id) => achievements.find((a) => a.id === id))
      .filter(Boolean) as Toast[]

    setToasts((t) => [...t, ...newToasts])
    setPrev(earnedAchievements)

    // Auto-remove after 4 seconds
    newToasts.forEach((toast) => {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== toast.id))
      }, 4000)
    })
  }, [earnedAchievements]) // eslint-disable-line

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="achievement-in bg-[#0d0d1a] border border-indigo-500/40 rounded-xl px-4 py-3 shadow-xl shadow-indigo-900/30 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-0.5">🏆</div>
            <div>
              <p className="text-white font-bold text-sm">{toast.title}</p>
              <p className="text-white/50 text-xs mt-0.5">{toast.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
