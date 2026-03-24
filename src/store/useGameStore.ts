/**
 * Global Game State Store using Zustand.
 * Manages: UI visibility, audio settings, active section, achievements, etc.
 */
import { create } from 'zustand'

export type Section = 'none' | 'projects' | 'about' | 'skills' | 'contact'

interface Achievement {
  id: string
  title: string
  description: string
}

interface GameState {
  // Phase
  loaded: boolean
  setLoaded: (v: boolean) => void

  // Audio
  musicEnabled: boolean
  toggleMusic: () => void

  // Active section popup
  activeSection: Section
  setActiveSection: (s: Section) => void

  // Instructions
  showInstructions: boolean
  setShowInstructions: (v: boolean) => void

  // Achievements
  achievements: Achievement[]
  earnedAchievements: string[]
  triggerAchievement: (id: string) => void

  // Easter eggs found
  easterEggsFound: number
  addEasterEgg: () => void
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_drive', title: '🚗 First Drive', description: 'You started your journey!' },
  { id: 'explorer', title: '🔭 Explorer', description: 'You visited all 4 sections.' },
  { id: 'easter_egg', title: '🥚 Secret Found!', description: 'You discovered a hidden area.' },
  { id: 'speed_demon', title: '⚡ Speed Demon', description: 'You drove at full throttle!' },
  { id: 'all_eggs', title: '🐣 Egg Collector', description: 'You found all 3 easter eggs!' },
]

export const useGameStore = create<GameState>((set, get) => ({
  loaded: false,
  setLoaded: (v) => set({ loaded: v }),

  musicEnabled: false,
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),

  activeSection: 'none',
  setActiveSection: (s) => {
    set({ activeSection: s })
    // Trigger explorer achievement when all 4 sections visited
    // (Tracked externally via a Set in a hook for simplicity)
  },

  showInstructions: true,
  setShowInstructions: (v) => set({ showInstructions: v }),

  achievements: ACHIEVEMENTS,
  earnedAchievements: [],
  triggerAchievement: (id) => {
    const { earnedAchievements } = get()
    if (!earnedAchievements.includes(id)) {
      set({ earnedAchievements: [...earnedAchievements, id] })
    }
  },

  easterEggsFound: 0,
  addEasterEgg: () => {
    const next = get().easterEggsFound + 1
    set({ easterEggsFound: next })
    get().triggerAchievement('easter_egg')
    if (next >= 3) get().triggerAchievement('all_eggs')
  },
}))
