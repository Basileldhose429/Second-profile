import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody, RapierRigidBody, useRevoluteJoint } from '@react-three/rapier'
import { useRef } from 'react'
import * as THREE from 'three'

interface VehicleProps {
  position?: [number, number, number]
}

export default function Vehicle({ position = [0, 2, 0] }: VehicleProps) {
  const chassisRef = useRef<RapierRigidBody>(null!)
  const wheel1Ref = useRef<RapierRigidBody>(null!)
  const wheel2Ref = useRef<RapierRigidBody>(null!)
  const wheel3Ref = useRef<RapierRigidBody>(null!)
  const wheel4Ref = useRef<RapierRigidBody>(null!)

  const [, getKeys] = useKeyboardControls()

  // Constants
  const engineForce = 1500
  const maxSteer = Math.PI / 4 // 45 degrees
  const steeringSpeed = 5

  // Connect wheels to chassis using revolute joints
  // Front Left
  useRevoluteJoint(chassisRef, wheel1Ref, [
    [-1, -0.5, 1.2], // position relative to chassis
    [0, 0, 0], // position relative to wheel
    [1, 0, 0], // axis relative to chassis
  ])
  // Front Right
  useRevoluteJoint(chassisRef, wheel2Ref, [
    [1, -0.5, 1.2],
    [0, 0, 0],
    [1, 0, 0],
  ])
  // Back Left
  const j3 = useRevoluteJoint(chassisRef, wheel3Ref, [
    [-1, -0.5, -1.2],
    [0, 0, 0],
    [1, 0, 0],
  ])
  // Back Right
  const j4 = useRevoluteJoint(chassisRef, wheel4Ref, [
    [1, -0.5, -1.2],
    [0, 0, 0],
    [1, 0, 0],
  ])

  // Current steering angle
  const steeringAngle = useRef(0)

  useFrame((state, delta) => {
    if (!chassisRef.current || !wheel1Ref.current || !wheel2Ref.current || !wheel3Ref.current || !wheel4Ref.current) return

    const { forward, backward, left, right, brake } = getKeys()

    // 1. Steering Logic (Front Wheels)
    const targetSteer = (left ? maxSteer : 0) - (right ? maxSteer : 0)
    steeringAngle.current = THREE.MathUtils.lerp(steeringAngle.current, targetSteer, delta * steeringSpeed)

    // Motorized wheels (Rear Wheels)
    const currentVelocity = chassisRef.current.linvel()
    const speed = Math.sqrt(currentVelocity.x ** 2 + currentVelocity.z ** 2)
    
    // Apply motor to rear joints
    let enginePower = 0;
    if (forward) enginePower = engineForce;
    if (backward) enginePower = -engineForce;
    
    // In Rapier, configureMotorVelocity takes (targetVelocity, maxMotorForce)
    if (j3.current && j4.current) {
      if (enginePower !== 0) {
        j3.current.configureMotorVelocity(enginePower * (forward ? -1 : 1), 10);
        j4.current.configureMotorVelocity(enginePower * (forward ? -1 : 1), 10);
      } else if (brake) {
        j3.current.configureMotorVelocity(0, 50);
        j4.current.configureMotorVelocity(0, 50);
      } else {
        j3.current.configureMotorVelocity(0, 1); // some friction
        j4.current.configureMotorVelocity(0, 1);
      }
    }

    // Front wheels steering via changing the axis for the joint (Hackish but simple)
    // Actually the proper way is to change the joint axis or apply a kinematic steering body.
    // Let's steer by applying small torque to chassis based on steering angle and speed
    if (speed > 1) {
      if (left) chassisRef.current.applyTorqueImpulse({ x: 0, y: 1 * delta * speed, z: 0 }, true);
      if (right) chassisRef.current.applyTorqueImpulse({ x: 0, y: -1 * delta * speed, z: 0 }, true);
    }
    
    // Camera follow script
    const chassisPos = chassisRef.current.translation()
    const cameraPosition = new THREE.Vector3(chassisPos.x, chassisPos.y + 5, chassisPos.z + 10)
    state.camera.position.lerp(cameraPosition, 0.1)
    state.camera.lookAt(chassisPos.x, chassisPos.y, chassisPos.z)
  })

  return (
    <group position={position}>
      {/* Chassis */}
      <RigidBody ref={chassisRef} position={[0, 0, 0]} colliders="cuboid" mass={1}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1, 3]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
        {/* Cabin */}
        <mesh castShadow receiveShadow position={[0, 0.75, -0.5]}>
          <boxGeometry args={[1.5, 0.5, 1.5]} />
          <meshStandardMaterial color="#FFF" />
        </mesh>
      </RigidBody>

      {/* Wheels */}
      <RigidBody ref={wheel1Ref} position={[-1.2, -0.5, 1.2]} colliders="hull" mass={0.2}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      <RigidBody ref={wheel2Ref} position={[1.2, -0.5, 1.2]} colliders="hull" mass={0.2}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      <RigidBody ref={wheel3Ref} position={[-1.2, -0.5, -1.2]} colliders="hull" mass={0.2}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      <RigidBody ref={wheel4Ref} position={[1.2, -0.5, -1.2]} colliders="hull" mass={0.2}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>
    </group>
  )
}
