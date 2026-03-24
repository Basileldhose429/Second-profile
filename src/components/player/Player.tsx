/**
 * Player.tsx
 * The drivable vehicle with:
 *  - Rapier rigid-body physics
 *  - WASD / Arrow key input (via KeyboardControls)
 *  - Torque-based steering applied to chassis
 *  - Mouse-camera follow with slight lag (lerped)
 *  - Jump mechanic (Space)
 *  - Section proximity detection → updates Zustand store
 *  - Achievement triggers (first drive, speed demon)
 */
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore, type Section } from '../../store/useGameStore'

/* ── Section proximity zones (world positions) ─────────────────── */
const ZONES: { section: Section; pos: [number, number, number]; radius: number }[] = [
  { section: 'projects',  pos: [18, 0, -18],  radius: 10 },
  { section: 'about',     pos: [-18, 0, -18], radius: 10 },
  { section: 'skills',    pos: [18, 0, 18],   radius: 10 },
  { section: 'contact',   pos: [-18, 0, 18],  radius: 10 },
]

const EASTER_EGG_ZONES: { id: string; pos: [number, number, number]; radius: number }[] = [
  { id: 'egg1', pos: [0, 0, -22],   radius: 3 },
  { id: 'egg2', pos: [22, 0, 0],    radius: 3 },
  { id: 'egg3', pos: [-22, 0, 0],   radius: 3 },
]

const tmpVec = new THREE.Vector3()
const tmpVec2 = new THREE.Vector3()

export default function Player() {
  const chassisRef = useRef<RapierRigidBody>(null!)
  const meshRef    = useRef<THREE.Group>(null!)

  const { camera } = useThree()
  const [, getKeys] = useKeyboardControls()
  const { setActiveSection, activeSection, triggerAchievement, addEasterEgg } = useGameStore()

  /* Camera mouse look with pointer-lock */
  const yaw   = useRef(0)
  const pitch = useRef(0.3)
  const foundEggs = useRef<Set<string>>(new Set())
  const visitedSections = useRef<Set<string>>(new Set())
  const hasDriven = useRef(false)
  const speedTimer = useRef(0)

  /* E key interaction */
  useEffect(() => {
    const onKey = (_e: KeyboardEvent) => {
      // E key reserved for future zone-specific interactions
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Mouse look (pointer lock integration) */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      yaw.current   -= e.movementX * 0.002
      pitch.current -= e.movementY * 0.002
      pitch.current  = Math.max(0.05, Math.min(0.8, pitch.current))
    }
    const onClick = () => {
      document.documentElement.requestPointerLock?.()
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useFrame((_state, delta) => {
    if (!chassisRef.current) return
    const { forward, backward, left, right, brake } = getKeys() as {
      forward: boolean; backward: boolean; left: boolean; right: boolean; brake: boolean
    }

    /* ── Input forces ────────────────────────────────────────── */
    const engineForce = 700
    const steerTorque  = 150

    // Apply linear force along chassis forward direction
    const rot = chassisRef.current.rotation()
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
    const fwd  = new THREE.Vector3(0, 0, -1).applyQuaternion(quat)

    if (forward)  chassisRef.current.applyImpulse({ x: fwd.x * engineForce * delta, y: 0, z: fwd.z * engineForce * delta }, true)
    if (backward) chassisRef.current.applyImpulse({ x: -fwd.x * engineForce * delta, y: 0, z: -fwd.z * engineForce * delta }, true)
    if (left)     chassisRef.current.applyTorqueImpulse({ x: 0, y: steerTorque * delta, z: 0 }, true)
    if (right)    chassisRef.current.applyTorqueImpulse({ x: 0, y: -steerTorque * delta, z: 0 }, true)

    // Angular damping to prevent infinite spinning
    const av = chassisRef.current.angvel()
    chassisRef.current.setAngvel({ x: av.x * 0.85, y: av.y * 0.88, z: av.z * 0.85 }, true)

    // Brake: strong linear damping
    if (brake) {
      const lv = chassisRef.current.linvel()
      chassisRef.current.setLinvel({ x: lv.x * 0.85, y: lv.y, z: lv.z * 0.85 }, true)
    }

    /* First drive achievement */
    if ((forward || backward) && !hasDriven.current) {
      hasDriven.current = true
      triggerAchievement('first_drive')
    }

    /* Speed demon achievement: sustained high speed */
    const lv = chassisRef.current.linvel()
    const spd = Math.sqrt(lv.x ** 2 + lv.z ** 2)
    if (spd > 12) {
      speedTimer.current += delta
      if (speedTimer.current > 3) triggerAchievement('speed_demon')
    } else {
      speedTimer.current = 0
    }

    /* ── Camera follow ───────────────────────────────────────── */
    const pos = chassisRef.current.translation()
    const dist   = 14
    const height = 6

    tmpVec.set(
      pos.x + Math.sin(yaw.current) * dist,
      pos.y + height + Math.sin(pitch.current) * dist * 0.5,
      pos.z + Math.cos(yaw.current) * dist,
    )
    camera.position.lerp(tmpVec, 0.08)
    tmpVec2.set(pos.x, pos.y + 1, pos.z)
    camera.lookAt(tmpVec2)

    /* ── Car mesh visual rotation ────────────────────────────── */
    if (meshRef.current) {
      meshRef.current.position.set(pos.x, pos.y, pos.z)
      meshRef.current.quaternion.copy(quat)
    }

    /* ── Section proximity ───────────────────────────────────── */
    let nearSection: Section = 'none'
    for (const zone of ZONES) {
      const dx = pos.x - zone.pos[0]
      const dz = pos.z - zone.pos[2]
      if (Math.sqrt(dx * dx + dz * dz) < zone.radius) {
        nearSection = zone.section
        visitedSections.current.add(zone.section)
        break
      }
    }
    if (nearSection !== activeSection) setActiveSection(nearSection)
    if (visitedSections.current.size >= 4) triggerAchievement('explorer')

    /* ── Easter eggs ─────────────────────────────────────────── */
    for (const egg of EASTER_EGG_ZONES) {
      if (foundEggs.current.has(egg.id)) continue
      const dx = pos.x - egg.pos[0]
      const dz = pos.z - egg.pos[2]
      if (Math.sqrt(dx * dx + dz * dz) < egg.radius) {
        foundEggs.current.add(egg.id)
        addEasterEgg()
      }
    }
  })

  return (
    <>
      {/* Physics body (invisible cuboid) */}
      <RigidBody
        ref={chassisRef}
        position={[0, 2, 0]}
        colliders="cuboid"
        mass={1}
        linearDamping={0.5}
        angularDamping={0.5}
        friction={0.5}
      >
        {/* Invisible collision hull */}
        <mesh visible={false}>
          <boxGeometry args={[1.8, 0.8, 3.5]} />
          <meshBasicMaterial />
        </mesh>
      </RigidBody>

      {/* Visual car mesh (follows physics body) */}
      <group ref={meshRef}>
        {/* Chassis body */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[1.8, 0.6, 3.5]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Cabin */}
        <mesh castShadow receiveShadow position={[0, 0.85, 0.1]}>
          <boxGeometry args={[1.4, 0.6, 2.0]} />
          <meshStandardMaterial color="#312e81" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Windshield */}
        <mesh castShadow position={[0, 0.92, -0.88]}>
          <boxGeometry args={[1.3, 0.5, 0.08]} />
          <meshStandardMaterial color="#a5b4fc" opacity={0.6} transparent metalness={0.1} roughness={0} />
        </mesh>
        {/* Headlights */}
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.35, -1.76]}>
            <boxGeometry args={[0.3, 0.2, 0.05]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={2} />
          </mesh>
        ))}
        {/* Taillights */}
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.35, 1.76]}>
            <boxGeometry args={[0.3, 0.2, 0.05]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
        ))}
        {/* Wheels */}
        {[[-0.95, 0, -1.2], [0.95, 0, -1.2], [-0.95, 0, 1.2], [0.95, 0, 1.2]].map(([x, y, z]) => (
          <mesh key={`${x}${z}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.35, 16]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
        ))}
        {/* Wheel rims */}
        {[[-0.95, 0, -1.2], [0.95, 0, -1.2], [-0.95, 0, 1.2], [0.95, 0, 1.2]].map(([x, y, z]) => (
          <mesh key={`rim_${x}${z}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.36, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </>
  )
}
