import { getField } from '../../../engine/field/fieldPerLevel'
import { getSnakeBodyLocation, setSnakeBodyLocation } from './snakeBodyLocation'
import {
  getSnakeUnitPosition,
  getSnakeUnitRotation,
  setSnakeUnitPosition,
  setSnakeUnitRotation,
} from './snakeBodyProps'
import { getDiff, setDiff } from './snakeDiff'

function toSceneCoord(coord: number[]): [number, number] {
  const fieldOffset = (getField() + 1) / 2
  return [coord[0] - fieldOffset, coord[1] - fieldOffset]
}

function syncDiff(diff: { diffX: number; diffY: number }, index: number): void {
  setDiff(diff, index)
  setDiff(diff, index)
}

export function syncSnakeGrowthTail(bodyCoords: number[][], previousLength: number): void {
  const oldTailIndex = previousLength - 2
  const newTailIndex = previousLength - 1
  const newReserveIndex = bodyCoords.length - 1
  const positions = getSnakeUnitPosition().map((position) => [...position])
  const rotations = getSnakeUnitRotation().map((rotation) => [...rotation])
  const locations = getSnakeBodyLocation().map((location) => [...location])

  if (positions[oldTailIndex]) {
    positions[newTailIndex] = [...positions[oldTailIndex]]
    locations[newTailIndex] = [...locations[oldTailIndex]]
    rotations[newTailIndex] = [...rotations[oldTailIndex]]
    syncDiff({ ...getDiff()[oldTailIndex] }, newTailIndex)
  }

  const [reserveX, reserveY] = toSceneCoord(bodyCoords[newReserveIndex])
  positions[newReserveIndex] = [reserveX, reserveY, 0]
  locations[newReserveIndex] = [reserveX, reserveY]
  rotations[newReserveIndex] = rotations[newTailIndex]
    ? [...rotations[newTailIndex]]
    : [0, 0, 0]

  const previousLocation = locations[newTailIndex]
  if (previousLocation) {
    syncDiff(
      {
        diffX: previousLocation[0] - reserveX,
        diffY: previousLocation[1] - reserveY,
      },
      newReserveIndex
    )
  }

  setSnakeUnitPosition(positions)
  setSnakeUnitRotation(rotations)
  setSnakeBodyLocation(locations)
}
