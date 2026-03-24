/**
 * SectionModal.tsx
 * Full-screen HTML panel shown when the player enters a 3D zone (E key interaction).
 * Covers all portfolio sections: Projects, About, Skills, Contact.
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGameStore, type Section } from '../../store/useGameStore'

/* ─── Content ─────────────────────────────────────────────────── */

const PROJECTS = [
  { title: 'GTA Web Clone', desc: 'A browser-based GTA-style open world game built with Three.js and Rapier physics.', tech: ['Three.js', 'Rapier', 'React'], emoji: '🚗' },
  { title: 'Nutrition Tracker', desc: 'Full-stack nutrition logging app with macro tracking, charts, and streak system.', tech: ['React', 'TailwindCSS', 'Chart.js'], emoji: '🥗' },
  { title: '3D Portfolio', desc: 'This very portfolio – a drivable 3D game world built to showcase my work.', tech: ['R3F', 'GSAP', 'Zustand'], emoji: '🌐' },
]

const SKILLS = [
  { cat: 'Frontend', items: ['React', 'TypeScript', 'TailwindCSS', 'Three.js', 'GSAP'] },
  { cat: 'Backend', items: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB'] },
  { cat: '3D / Game', items: ['React Three Fiber', 'Rapier Physics', 'Blender', 'WebGL'] },
  { cat: 'Tools', items: ['Vite', 'Git', 'Docker', 'Vercel', 'Figma'] },
]

/* ─── Component ────────────────────────────────────────────────── */

export default function SectionModal() {
  const { activeSection, setActiveSection } = useGameStore()
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const isOpen = activeSection !== 'none'

  useEffect(() => {
    if (isOpen && overlayRef.current && panelRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(panelRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.3)' })
    }
  }, [isOpen])

  const close = () => {
    if (!overlayRef.current || !panelRef.current) return
    gsap.to(panelRef.current, { y: 40, opacity: 0, duration: 0.3, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, onComplete: () => setActiveSection('none') })
  }

  if (!isOpen) return null

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div
        ref={panelRef}
        className="bg-[#0a0a18] border border-indigo-500/20 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl shadow-indigo-900/40"
      >
        <ModalContent section={activeSection} onClose={close} />
      </div>
    </div>
  )
}

/* ─── Section renderers ─────────────────────────────────────────── */

function ModalContent({ section, onClose }: { section: Section; onClose: () => void }) {
  const Header = ({ title, subtitle, emoji }: { title: string; subtitle: string; emoji: string }) => (
    <div className="flex items-start justify-between p-6 pb-0">
      <div>
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-white font-black text-3xl">{title}</h2>
        <p className="text-white/40 text-sm mt-1">{subtitle}</p>
      </div>
      <button onClick={onClose} className="text-white/30 hover:text-white text-2xl transition-colors mt-1 cursor-pointer">✕</button>
    </div>
  )

  if (section === 'projects') return (
    <div className="p-6">
      <Header title="Projects" subtitle="Things I've built" emoji="🏗️" />
      <div className="mt-6 grid gap-4">
        {PROJECTS.map((p) => (
          <div key={p.title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-indigo-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{p.emoji}</span>
              <h3 className="text-white font-bold text-lg group-hover:text-indigo-300 transition-colors">{p.title}</h3>
            </div>
            <p className="text-white/50 text-sm mb-3">{p.desc}</p>
            <div className="flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span key={t} className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-full px-3 py-0.5">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (section === 'about') return (
    <div className="p-6">
      <Header title="About Me" subtitle="The person behind the keyboard" emoji="🙋" />
      <div className="mt-6 space-y-4">
        <p className="text-white/70 leading-relaxed text-sm">
          Hey! I'm <span className="text-indigo-400 font-bold">Basil</span>, a creative frontend developer obsessed with building immersive web experiences.
          I blend code and design to create things that feel alive — from game-like UIs to full 3D interactive worlds.
        </p>
        <p className="text-white/70 leading-relaxed text-sm">
          I specialize in React, Three.js, and TypeScript, with a deep love for procedural generation, physics simulations, and the feeling when everything just *clicks*. When I'm not coding, I'm likely in Blender, Figma, or playing video games for "research".
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[['📍 Location', 'Kerala, India'], ['💼 Role', 'Frontend Developer'], ['🎓 Focus', 'WebGL & 3D Web'], ['🌐 Open to', 'Freelance & Full-time']].map(([l, v]) => (
            <div key={l} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-white/40 text-xs">{l}</p>
              <p className="text-white font-medium text-sm mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (section === 'skills') return (
    <div className="p-6">
      <Header title="Skills" subtitle="My technical arsenal" emoji="⚡" />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SKILLS.map(({ cat, items }) => (
          <div key={cat} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="text-indigo-400 font-bold text-xs tracking-wider uppercase mb-3">{cat}</h4>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span key={item} className="text-xs bg-white/10 text-white/70 rounded-lg px-2 py-1">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (section === 'contact') return (
    <div className="p-6">
      <Header title="Contact" subtitle="Let's build something awesome" emoji="📬" />
      <div className="mt-6 space-y-3">
        {[
          { icon: '✉️', label: 'Email', value: 'basil@example.com', href: 'mailto:basil@example.com' },
          { icon: '🐱', label: 'GitHub', value: 'github.com/basileldhose429', href: 'https://github.com' },
          { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/basil', href: 'https://linkedin.com' },
        ].map(({ icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-indigo-500/40 hover:bg-white/10 transition-all group"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
              <p className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors">{value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )

  return null
}
