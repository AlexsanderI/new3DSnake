import * as React from 'react'
import { getField } from '../engine/field/fieldPerLevel'
import { getFoodCoord } from '../engine/food/food'
import { Position2D, Position3D } from '../types/threeTypes'

const ROUNDING_OFFSET = 0.5

const isValidCoord = (coord: unknown): coord is Position2D =>
  Array.isArray(coord) &&
  coord.length === 2 &&
  coord.every((value) => typeof value === 'number' && Number.isFinite(value))

/**
 * Хук для управления позицией яблока
 */
export const useApplePosition = (zLocation: number) => {
  const fieldSize = getField()
  const halfField = React.useMemo(() => fieldSize / 2 + 1, [fieldSize])
  const [position, setPosition] = React.useState<Position3D | null>(null)

  const fastRound = React.useCallback(
    (value: number) => (value + ROUNDING_OFFSET) | 0,
    []
  )

  const transformCoordinates = React.useCallback(
    (coord: Position2D): Position3D => [
      fastRound(coord[0] - halfField),
      fastRound(coord[1] - halfField),
      zLocation,
    ],
    [halfField, zLocation, fastRound]
  )

  const positionChanged = React.useCallback(
    (prev: Position3D, next: Position3D): boolean =>
      prev[0] !== next[0] || prev[1] !== next[1],
    []
  )

  const updatePosition = React.useCallback(() => {
    const foodCoord = getFoodCoord()
    if (!isValidCoord(foodCoord)) return

    const adjustedPosition = transformCoordinates(foodCoord)
    setPosition((prev) =>
      !prev || positionChanged(prev, adjustedPosition) ? adjustedPosition : prev
    )
  }, [transformCoordinates, positionChanged])

  return { position, updatePosition }
}
