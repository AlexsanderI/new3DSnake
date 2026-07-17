import { SnakeHeadCoord } from '../../types/snakeTypes'
import { getField } from '../field/fieldPerLevel'
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import {
  getOscillatingStationaryX,
  getOscillatingStationaryY,
} from '../obstacles/moveObstacles'
import { getSnakeBodyCoord } from '../snake/snake'
import snakeCoordCompare from './snakeCoordCompare'

function getOscillatingStationaryObstacles(): number[][] {
  return getOscillatingStationaryX()
    .concat(getOscillatingStationaryY())
    .filter((coord) => coord.length === 2)
}

function noMoves(snakeHeadPos: SnakeHeadCoord): boolean {
  let prohibitedCells: number[][] = []

  prohibitedCells = getObstaclesFixCoord()
    .concat(getOscillatingStationaryObstacles(), getSnakeBodyCoord().slice(1))
  let checkSnakePos: SnakeHeadCoord = { ...snakeHeadPos }
  let contact: boolean
  const directions = [
    { coord: [1, 0], name: 'X' as const, value: 1 as const },
    { coord: [-1, 0], name: 'X' as const, value: -1 as const },
    { coord: [0, 1], name: 'Y' as const, value: 1 as const },
    { coord: [0, -1], name: 'Y' as const, value: -1 as const },
  ]
  const availableDirections: { name: 'X' | 'Y'; value: 1 | -1 }[] = []

  directions.forEach(({ coord, name, value }) => {
    checkSnakePos = {
      ...snakeHeadPos,
      snakeHeadCoordX: snakeHeadPos.snakeHeadCoordX + coord[0],
      snakeHeadCoordY: snakeHeadPos.snakeHeadCoordY + coord[1],
      snakeHeadStepX: coord[0],
      snakeHeadStepY: coord[1],
    }
    contact = false
    prohibitedCells.forEach((pos) => {
      ;[checkSnakePos, contact] = snakeCoordCompare(checkSnakePos, pos, contact)
    })
    const outOfBounds =
      checkSnakePos.snakeHeadCoordX < 1 ||
      checkSnakePos.snakeHeadCoordX > getField() ||
      checkSnakePos.snakeHeadCoordY < 1 ||
      checkSnakePos.snakeHeadCoordY > getField()
    if (outOfBounds) {
      contact = true
    }
    const isValidDirection = !contact
    if (isValidDirection) {
      const dirX = checkSnakePos.snakeHeadCoordX - snakeHeadPos.snakeHeadCoordX
      const dirY = checkSnakePos.snakeHeadCoordY - snakeHeadPos.snakeHeadCoordY
      if (dirX !== 0) {
        availableDirections.push({
          name: 'X',
          value: dirX > 0 ? (1 as const) : (-1 as const),
        })
      }
      if (dirY !== 0) {
        availableDirections.push({
          name: 'Y',
          value: dirY > 0 ? (1 as const) : (-1 as const),
        })
      }
    }
  })

  return availableDirections.length === 0
}

export default noMoves
