import { useMemo } from 'react'
import * as THREE from 'three'
import { RockProps } from '../../types/obstacleTypes'
import mulberry32 from '../../commands/mulberry32'

type Props = RockProps & { seed?: number }

function Rock({ color = 0xacacac, seed = 1, position, rotation, scale }: Props) {
  const geom = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(0.5)

    // Плоское основание по Z: все нижние вершины выравниваем в одну плоскость
    const pos = geometry.attributes.position
    let minZ = Infinity
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i)
      if (z < minZ) minZ = z
    }

    const flatZ = minZ + 0.4 // чуть приподнять над полем (подгонишь по вкусу)
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i)
      if (z <= flatZ) {
        pos.setZ(i, flatZ)
      }
    }

    pos.needsUpdate = true
    geometry.computeVertexNormals()

    return geometry
  }, [])

  const { s, r, zLift } = useMemo(() => {
    const rnd = mulberry32(seed)

    // как в three-snake-live, только ось "вверх" у тебя это Z (потому что plane лежит в XY)
    const sx = rnd() * 0.5 + 0.5
    const sy = rnd() * 0.5 + 0.5
    const sz = 0.5 + Math.pow(rnd(), 2) * 0.2 // делаем "высоту" по Z

    const yaw = rnd() * Math.PI * 2 // вокруг вертикали Z
    const tilt = rnd() * Math.PI * 0.1 // легкий наклон

    // zLift вычисляем из geometry, чтобы основание точно на земле
    const baseZ = -0.5 * 0.8 // высота/2 (центр геометрии)
    const zLiftAbsolute = -baseZ

    return {
      s: [sx, sy, sz] as [number, number, number],
      r: [tilt, 0, yaw] as [number, number, number],
      zLift: zLiftAbsolute,
    }
  }, [seed])

  return (
    <mesh
      geometry={geom}
      castShadow
      receiveShadow
      position={position ?? [0, 0, zLift]}
      rotation={rotation ?? r}
      scale={scale ?? s}
    >
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

export default Rock
