import { useMemo } from 'react'
import { MushroomProps } from '../../types/obstacleTypes'
import mulberry32 from '../../commands/mulberry32'

type Props = MushroomProps & {
  seed?: number
  capHeightRatio?: number
  capWidthRatio?: number
  stemThicknessRatio?: number
}
/**
 * Генерирует позиции белых точек на верхней полусфере шляпки гриба.
 * Координаты локальные — относительно центра шляпки.
 * useMemo гарантирует, что точки создаются один раз и не пересчитываются
 * каждый кадр (это была причина "прыжков" точек).
 */
function createDotPositions(radius: number, count: number): [number, number, number][] {
  const positions: [number, number, number][] = []
  // Спираль Фибоначчи только по верхней полусфере (y от 0 до 1)
  const step = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    const y = i / (count - 1) // от 0 до 1, только верхняя полусфера
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = step * i

    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY

    positions.push([x * radius, y * radius, z * radius])
  }

  return positions
}

function Mushroom(props: Props) {
  const {
    position = [0, 5, 0],
    rotation = [0, 0, 0],
    scale,
    seed = 1,
    capHeightRatio = 0.4,
    capWidthRatio = 1.5,
    stemThicknessRatio = 0.2,
  } = props

  const { sphereRadius, dotCount, totalHeight, capHeight, stemHeight, stemRadius } =
    useMemo(() => {
      const rnd = mulberry32(seed)
      const SphR = 6 + 3 * rnd() // рандомный радиус шляпки от 4 до 10 (настраивай по вкусу)
      const dtCnt = 20 * rnd() + 10 // рандомное количество точек от 10 до 30 (настраивай по вкусу)

      // Общая высота гриба (шляпка + ножка), пропорциональная диаметру шляпки
      const totalH = SphR * 1.5 // например, высота = 2 * радиус шляпки
      const capH = totalH * capHeightRatio + 3 * rnd() // высота шляпки
      const stemH = totalH * (1 - capHeightRatio) + 2 * rnd() // высота ножки
      const stemR = stemH * stemThicknessRatio // радиус ножки

      return {
        sphereRadius: SphR,
        dotCount: dtCnt,
        totalHeight: totalH,
        capHeight: capH,
        stemHeight: stemH,
        stemRadius: stemR,
      }
    }, [seed, capHeightRatio])

  // useMemo — точки вычисляются один раз, не пересоздаются на каждый рендер
  const dotPositions = useMemo(
    () => createDotPositions(sphereRadius, dotCount),
    [sphereRadius, dotCount],
  )

  return (
    // scale и rotation передаём напрямую в JSX — useFrame для этого не нужен
    <group
      position={position}
      rotation={[rotation[0] + Math.PI / 2, rotation[1], rotation[2]]} // +45° по X
      scale={[0.7, 0.7, 0.7]} // чуть сплющим по Z, чтобы не было слишком "высоким"
    >
      {/* Ствол */}
      <mesh position={[0, 4, 5]} scale={[1, 1, 1]} receiveShadow castShadow>
        <cylinderGeometry args={[5, 6, 12, 9]} />
        <meshStandardMaterial color={'#f5e642'} />
      </mesh>

      {/* Шляпка + точки в одной группе — точки двигаются вместе со шляпкой */}
      <group
        position={[0, stemHeight + 2, 5]}
        scale={[1.2, capHeight / sphereRadius, 1.2]}
      >
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[sphereRadius, 32, 32]} />
          <meshStandardMaterial color={'#cc1a1a'} />
        </mesh>

        {/* Белые точки: координаты локальные, никаких магических офсетов */}
        {dotPositions.map((pos, i) => (
          <mesh key={i} position={pos} /*receiveShadow castShadow*/>
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default Mushroom
