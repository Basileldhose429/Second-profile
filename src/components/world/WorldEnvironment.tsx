/**
 * WorldEnvironment.tsx
 * The complete 3D world:
 *  - Ground plane
 *  - Road markings (crossing stripes)
 *  - Four portfolio zone buildings with 3D text
 *  - Decorative scenery (trees, lamp posts)
 *  - Border walls
 *  - Easter egg glowing orbs (hidden)
 */
import { Text, Box, Cylinder, Sphere } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

/* ── Helper components ─────────────────────────────────────────── */

/** A stylised low-poly building block */
function Building({ position, size, color, roofColor, label, labelColor = '#ffffff' }: {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  roofColor: string
  label: string
  labelColor?: string
}) {
  return (
    <group position={position}>
      {/* Main body */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box args={size} castShadow receiveShadow>
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
        </Box>
        {/* Roof */}
        <Box args={[size[0] + 0.3, 0.3, size[2] + 0.3]} position={[0, size[1] / 2 + 0.15, 0]}>
          <meshStandardMaterial color={roofColor} metalness={0.3} roughness={0.5} />
        </Box>
      </RigidBody>
      {/* 3D Label above building */}
      <Text
        position={[0, size[1] / 2 + 1.2, 0]}
        fontSize={1}
        color={labelColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  )
}

/** A simple tree */
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="hull">
        <Cylinder args={[0.15, 0.2, 1.5, 6]} position={[0, 0.75, 0]} castShadow>
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0, 1.6, 2.5, 7]} position={[0, 2.75, 0]} castShadow>
          <meshStandardMaterial color="#16a34a" roughness={0.8} />
        </Cylinder>
      </RigidBody>
    </group>
  )
}

/** Lamp post */
function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <Cylinder args={[0.08, 0.08, 4, 8]} position={[0, 2, 0]} castShadow>
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </Cylinder>
        {/* Lamp globe */}
        <Sphere args={[0.25, 8, 8]} position={[0, 4.3, 0]}>
          <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={4} />
        </Sphere>
        {/* Point light */}
        <pointLight position={[0, 4.3, 0]} intensity={20} distance={12} color="#fef3c7" />
      </RigidBody>
    </group>
  )
}

/** Glowing easter egg orb */
function EasterEgg({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Sphere args={[0.4, 12, 12]}>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3} transparent opacity={0.9} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={15} distance={8} color="#f59e0b" />
    </group>
  )
}

/* ── Ground pattern ────────────────────────────────────────────── */
function Ground() {
  return (
    <>
      {/* Base floor */}
      <RigidBody type="fixed" friction={1.5} restitution={0.1}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[56, 56]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.0} />
        </mesh>
      </RigidBody>
      {/* Road X-axis */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[56, 7]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Road Z-axis */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[7, 56]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Center lane markings */}
      {[-20, -14, -8, -2, 4, 10, 16].map((z) => (
        <mesh key={`laneZ${z}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}>
          <planeGeometry args={[0.25, 4]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      ))}
      {[-20, -14, -8, -2, 4, 10, 16].map((x) => (
        <mesh key={`laneX${x}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, 0]}>
          <planeGeometry args={[4, 0.25]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      ))}
    </>
  )
}

/* ── Border walls ──────────────────────────────────────────────── */
function BorderWalls() {
  const H = 3, T = 1, S = 56
  return (
    <>
      {[
        { pos: [0, H / 2, S / 2 + T / 2] as [number, number, number],  size: [S + T * 2, H, T] as [number, number, number] },
        { pos: [0, H / 2, -(S / 2 + T / 2)] as [number, number, number], size: [S + T * 2, H, T] as [number, number, number] },
        { pos: [S / 2 + T / 2, H / 2, 0] as [number, number, number],  size: [T, H, S] as [number, number, number] },
        { pos: [-(S / 2 + T / 2), H / 2, 0] as [number, number, number], size: [T, H, S] as [number, number, number] },
      ].map(({ pos, size }, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={pos}>
          <Box args={size} receiveShadow>
            <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.7} transparent opacity={0.85} />
          </Box>
        </RigidBody>
      ))}
    </>
  )
}

/* ── Main component ────────────────────────────────────────────── */
export default function WorldEnvironment() {
  // Decorative trees around the map
  const trees: [number, number, number][] = [
    [8, 0, -8], [-8, 0, -8], [8, 0, 8], [-8, 0, 8],
    [22, 0, -5], [-22, 0, -5], [22, 0, 5], [-22, 0, 5],
    [5, 0, 22], [-5, 0, 22], [5, 0, -22], [-5, 0, -22],
  ]
  // Lamp posts along roads
  const lamps: [number, number, number][] = [
    [4, 0, -12], [-4, 0, -12], [4, 0, 12], [-4, 0, 12],
    [12, 0, 4], [12, 0, -4], [-12, 0, 4], [-12, 0, -4],
  ]

  return (
    <>
      <Ground />
      <BorderWalls />

      {/* ── Four portfolio zones ── */}
      {/* PROJECTS — top-right */}
      <Building position={[18, 3.5, -18]} size={[8, 7, 8]} color="#1e3a5f" roofColor="#2563eb" label="PROJECTS" labelColor="#60a5fa" />

      {/* ABOUT ME — top-left */}
      <Building position={[-18, 2.5, -18]} size={[7, 5, 7]} color="#1a1a2e" roofColor="#7c3aed" label="ABOUT" labelColor="#a78bfa" />

      {/* SKILLS — bottom-right */}
      <Building position={[18, 3, 18]} size={[7, 6, 7]} color="#1f2d1f" roofColor="#16a34a" label="SKILLS" labelColor="#4ade80" />

      {/* CONTACT — bottom-left */}
      <Building position={[-18, 2, 18]} size={[6, 4, 6]} color="#2d1515" roofColor="#dc2626" label="CONTACT" labelColor="#f87171" />

      {/* ── Ramps ── */}
      {[
        { pos: [10, 0.25, 0] as [number, number, number], rot: [0, 0, Math.PI / 14] as [number, number, number] },
        { pos: [-10, 0.25, 0] as [number, number, number], rot: [0, 0, -Math.PI / 14] as [number, number, number] },
      ].map(({ pos, rot }, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={pos} rotation={rot}>
          <Box args={[5, 0.3, 6]} castShadow receiveShadow>
            <meshStandardMaterial color="#374151" />
          </Box>
        </RigidBody>
      ))}

      {/* ── Scatter decor ── */}
      {trees.map((pos, i) => <Tree key={i} position={pos} />)}
      {lamps.map((pos, i) => <LampPost key={i} position={pos} />)}

      {/* ── Easter egg spheres (hidden in corners) ── */}
      <EasterEgg position={[0, 0.5, -22]} />
      <EasterEgg position={[22, 0.5, 0]} />
      <EasterEgg position={[-22, 0.5, 0]} />

      {/* ── Central fountain / landmark ── */}
      <group position={[0, 0, 0]}>
        <RigidBody type="fixed" colliders="cuboid">
          <Cylinder args={[1.5, 1.5, 0.4, 12]} position={[0, 0.2, 0]} receiveShadow>
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </Cylinder>
        </RigidBody>
        <Cylinder args={[0.15, 0.15, 2.5, 8]} position={[0, 1.65, 0]} castShadow>
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1} />
        </Cylinder>
        <pointLight position={[0, 3, 0]} intensity={30} distance={15} color="#818cf8" />
      </group>
    </>
  )
}
