import { Text, Box, Cylinder } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

export default function EnvironmentObjects() {
  return (
    <>
      {/* Intro Text */}
      <RigidBody type="fixed" position={[0, 0.5, -5]} colliders="cuboid">
        <Text
          fontSize={2}
          color="#222"
          castShadow
          position={[0, 1, 0]}
        >
          HEY THERE!
        </Text>
      </RigidBody>

      {/* Projects Section */}
      <group position={[15, 0, -15]}>
        <RigidBody type="fixed" colliders="cuboid">
          <Text
            fontSize={1.5}
            color="#E63946"
            castShadow
            position={[0, 1, 0]}
          >
            PROJECTS
          </Text>
        </RigidBody>
        <RigidBody type="dynamic" position={[-2, 1, 2]}>
          <Box args={[1, 1, 1]} castShadow receiveShadow>
            <meshStandardMaterial color="#457B9D" />
          </Box>
        </RigidBody>
        <RigidBody type="dynamic" position={[0, 1, 2]}>
          <Box args={[1, 1, 1]} castShadow receiveShadow>
            <meshStandardMaterial color="#A8DADC" />
          </Box>
        </RigidBody>
        <RigidBody type="dynamic" position={[2, 1, 2]}>
          <Box args={[1, 1, 1]} castShadow receiveShadow>
            <meshStandardMaterial color="#1D3557" />
          </Box>
        </RigidBody>
      </group>

      {/* About Section */}
      <group position={[-15, 0, -15]}>
        <RigidBody type="fixed" colliders="cuboid">
          <Text
            fontSize={1.5}
            color="#2A9D8F"
            castShadow
            position={[0, 1, 0]}
          >
            ABOUT ME
          </Text>
        </RigidBody>
        <RigidBody type="dynamic" colliders="hull" position={[0, 1, 2]}>
          <Cylinder args={[0.5, 0.5, 2, 16]} castShadow receiveShadow>
            <meshStandardMaterial color="#E9C46A" />
          </Cylinder>
        </RigidBody>
      </group>

      {/* Obstacles & Props */}
      <RigidBody type="fixed" position={[5, 1, -5]}>
        <Box args={[2, 2, 2]} castShadow receiveShadow>
          <meshStandardMaterial color="#F4A261" />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" position={[-5, 1, -10]}>
        <Box args={[3, 2, 3]} castShadow receiveShadow>
          <meshStandardMaterial color="#F4A261" />
        </Box>
      </RigidBody>
      
      {/* Ramps */}
      <RigidBody type="fixed" position={[10, 0, 5]} rotation={[-Math.PI / 8, 0, 0]}>
        <Box args={[4, 0.5, 6]} castShadow receiveShadow>
          <meshStandardMaterial color="#E76F51" />
        </Box>
      </RigidBody>

      <RigidBody type="fixed" position={[-10, 0, 5]} rotation={[-Math.PI / 8, 0, 0]}>
        <Box args={[4, 0.5, 6]} castShadow receiveShadow>
          <meshStandardMaterial color="#E76F51" />
        </Box>
      </RigidBody>

      {/* Borders */}
      <RigidBody type="fixed" position={[0, 1, 25]}>
        <Box args={[50, 2, 1]} receiveShadow>
          <meshStandardMaterial color="#222" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" position={[0, 1, -25]}>
        <Box args={[50, 2, 1]} receiveShadow>
          <meshStandardMaterial color="#222" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" position={[25, 1, 0]}>
        <Box args={[1, 2, 50]} receiveShadow>
          <meshStandardMaterial color="#222" />
        </Box>
      </RigidBody>
      <RigidBody type="fixed" position={[-25, 1, 0]}>
        <Box args={[1, 2, 50]} receiveShadow>
          <meshStandardMaterial color="#222" />
        </Box>
      </RigidBody>
    </>
  )
}
