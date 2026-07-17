import { useMemo } from 'react'
import Rock from '../assets/rockModel/Rock'
import Tree from '../assets/treeModel/Tree'
import { getField } from '../engine/field/fieldPerLevel'
import { LandscapeObject } from '../types/landscapeTypes'

type DecorItem = LandscapeObject & {
  color?: number
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function distance2D(a: [number, number, number], b: [number, number, number]) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  return Math.sqrt(dx * dx + dy * dy)
}

function generateDecor(fieldSize: number, count: number): DecorItem[] {
  const items: DecorItem[] = []

  const halfField = fieldSize / 2

  // Насколько далеко от края поля можно начинать спавн
  const marginFromField = 2

  // Ширина кольца вокруг поля, где можно ставить декор
  const ringWidth = 6

  const innerLimit = halfField + marginFromField
  const outerLimit = innerLimit + ringWidth

  let attempts = 0
  const maxAttempts = count * 60

  while (items.length < count && attempts < maxAttempts) {
    attempts++

    let x = 0
    let y = 0

    // Генерируем только в кольце вокруг поля
    const side = Math.floor(randomBetween(0, 4))

    if (side === 0) {
      // left
      x = randomBetween(-outerLimit, -innerLimit)
      y = randomBetween(-outerLimit, outerLimit)
    } else if (side === 1) {
      // right
      x = randomBetween(innerLimit, outerLimit)
      y = randomBetween(-outerLimit, outerLimit)
    } else if (side === 2) {
      // bottom
      x = randomBetween(-outerLimit, outerLimit)
      y = randomBetween(-outerLimit, -innerLimit)
    } else {
      // top
      x = randomBetween(-outerLimit, outerLimit)
      y = randomBetween(innerLimit, outerLimit)
    }

    const position: [number, number, number] = [x, y, 0]

    const tooClose = items.some((item) => distance2D(item.position, position) < 2.6)
    if (tooClose) continue

    const seed = Math.floor(randomBetween(1, 999999))
    const isTree = Math.random() < 0.6
    const itemIndex = items.length

    if (isTree) {
      items.push({
        id: `tree-${seed}-${itemIndex}`,
        type: 'tree',
        position: [x, y, 0],
        scale: [
          randomBetween(1.6, 3.0),
          randomBetween(1.6, 3.0),
          randomBetween(1.8, 4.0),
        ],
        rotation: [
          randomBetween(-0.08, 0.08),
          randomBetween(-0.08, 0.08),
          randomBetween(0, Math.PI * 2),
        ],
        seed,
        color: [0xa2d109, 0x8fbe20, 0x7ead1d, 0x96c93d][Math.floor(randomBetween(0, 4))],
      })
    } else {
      items.push({
        id: `rock-${seed}-${itemIndex}`,
        type: 'rock',
        position: [x, y, 0.16],
        scale: [
          randomBetween(0.7, 1.8),
          randomBetween(0.7, 1.7),
          randomBetween(0.7, 1.5),
        ],
        rotation: [
          randomBetween(-0.15, 0.15),
          randomBetween(-0.15, 0.15),
          randomBetween(0, Math.PI * 2),
        ],
        seed,
        color: [0x9a9a9a, 0x8d8d8d, 0xa5a5a5][Math.floor(randomBetween(0, 3))],
      })
    }
  }

  return items
}

export default function Landscape() {
  const fieldSize = getField()

  // Плоскость оставляем большой, чтобы не было видно края
  const outerSize = fieldSize * 6

  const decor = useMemo(() => {
    return generateDecor(fieldSize, 36)
  }, [fieldSize])

  return (
    <group>
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <planeGeometry args={[outerSize, outerSize]} />
        <meshStandardMaterial color='#56f854' />
      </mesh>

      {decor.map((item, index) => {
        if (item.type === 'tree') {
          return (
            <Tree
              key={`tree-${index}`}
              position={item.position}
              scale={item.scale}
              rotation={item.rotation}
              seed={item.seed}
              color={item.color}
            />
          )
        }

        return (
          <Rock
            key={`rock-${index}`}
            position={item.position}
            scale={item.scale}
            rotation={item.rotation}
            seed={item.seed}
            color={item.color}
          />
        )
      })}
    </group>
  )
}
