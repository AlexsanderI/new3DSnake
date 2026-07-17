import { Vector2 } from 'three'
import { hedgehogProps } from '../../types/obstacleTypes'
import mulberry32 from '../../commands/mulberry32'

const FORWARD_OFFSET = 0.75

function Hedgehog(props: hedgehogProps) {
  const { direction, index, line, seed = index } = props

  const rnd = mulberry32(seed)
  const sizeScale = 0.7 + rnd() * 0.6 // размер от 0.7 до 1.3

  const frontPoints = []
  for (let i = 0; i < 10; i++) {
    frontPoints.push(
      new Vector2(
        ((Math.sin(i * 0.2) * 8 + 8) / 25) * sizeScale,
        ((i + 6) / 15) * sizeScale,
      ),
    )
  }

  const backPoints = []

  // Полукруглая заглушка (3 точки)
  const r = ((Math.sin(0 * 0.2) * 8 + 8) / 65) * sizeScale
  const y0 = ((0 * 0.9 - 21) / 15) * sizeScale
  backPoints.push(new Vector2(r, y0)) // край
  backPoints.push(new Vector2(r * 0.7, y0 - r * 0.3)) // середина дуги
  backPoints.push(new Vector2(0, y0 - r)) // центр (закрывает дырку)

  // Основные точки
  for (let i = 0; i < 10; i++) {
    backPoints.push(
      new Vector2(
        ((Math.sin(i * 0.2) * 8 + 8) / 25) * sizeScale,
        ((i * 0.9 - 21) / 15) * sizeScale,
      ),
    )
  }

  return (
    <group
      position={[
        line === 'x' ? direction[index] * FORWARD_OFFSET : 0,
        line === 'y' ? direction[index] * FORWARD_OFFSET : 0,
        0,
      ]}
    >
      <mesh
        position={[
          line === 'y' ? 0 : -0.2 * direction[index],
          line === 'y' ? -0.2 * direction[index] : 0,
          0,
        ]}
        rotation={[
          0,
          0,
          line === 'x' ? direction[index] * -1.57 : ((direction[index] - 1) / 2) * 3.14,
        ]}
        receiveShadow
        castShadow
      >
        <coneGeometry args={[0.4 * sizeScale, 0.5 * sizeScale, 3, 1, false, 4.7, 3.14]} />
        <meshStandardMaterial color='#A18E74' />
      </mesh>
      <mesh
        rotation={[
          0,
          0,
          line === 'y' ? direction[index] * 1.57 + 1.57 : direction[index] * 1.57,
        ]}
        receiveShadow
        castShadow
      >
        <latheGeometry args={[frontPoints, 12, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
      <mesh
        position={[0, 0, 0]}
        rotation={[
          0,
          0,
          line === 'y' ? direction[index] * 1.57 - 1.57 : direction[index] * -1.57,
        ]}
        receiveShadow
        castShadow
      >
        <latheGeometry args={[backPoints, 12, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>

      <mesh
        position={[
          line === 'x' ? direction[index] * -0.03 : 0,
          line === 'y' ? direction[index] * -0.03 : 0,
          0.05,
        ]}
        receiveShadow
        castShadow
      >
        <sphereGeometry args={[0.1 * sizeScale, 5]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
      <mesh
        position={
          line === 'y'
            ? [direction[index] * 0.2, direction[index] * -0.3, 0.2]
            : [direction[index] * -0.3, -0.2, 0.2]
        }
        receiveShadow
        castShadow
      >
        <sphereGeometry args={[0.1 * sizeScale, 5]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
      <mesh
        position={
          line === 'y'
            ? [direction[index] * -0.2, direction[index] * -0.3, 0.2]
            : [direction[index] * -0.3, 0.2, 0.2]
        }
        receiveShadow
        castShadow
      >
        <sphereGeometry args={[0.1 * sizeScale, 5]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
    </group>
  )
}

export default Hedgehog
