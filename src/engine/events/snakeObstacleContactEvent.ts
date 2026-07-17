/**
 * @module snakeObstacleContactEvent.ts Управляет контактом змейки с препятствиями
 *    @function snakeObstacleContactEvent Останавливает змейку у края препятствий
 */
import { SnakeHeadCoord } from '../../types/snakeTypes'
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import { getObstaclesStepX, getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesStepY, getObstaclesYCoord } from '../obstacles/obstaclesY'
import snakeCoordCompare from './snakeCoordCompare'
import { isContact } from './isContact'
import { getBreaksObstacles } from '../bonuses/bonusSnakeBreaksObstacles'
import isBroken from './isBroken'

function isSwapCollision(
  currentSnakeCell: [number, number],
  nextSnakeCell: [number, number],
  currentObstacleCell: [number, number],
  nextObstacleCell: [number, number],
): boolean {
  return (
    currentSnakeCell[0] === nextObstacleCell[0] &&
    currentSnakeCell[1] === nextObstacleCell[1] &&
    nextSnakeCell[0] === currentObstacleCell[0] &&
    nextSnakeCell[1] === currentObstacleCell[1]
  )
}
/**
 * Срабатывает при контакте головы змейки с препятствиями
 * @param snakeHead параметры головы змейки
 * @description
 *  1. сравнивает положение головы змейки с препятствиями
 *  2. при контакте запускает обрабатывающую функцию
 * @returns скорректированные при контакте с препятствием параметры головы змейки
 */
function snakeObstacleContactEvent(snakeHead: SnakeHeadCoord): SnakeHeadCoord {
  let contact = false
  const fixObstacles = getObstaclesFixCoord()
  const xObstacles = getObstaclesXCoord()
  const yObstacles = getObstaclesYCoord()
  const obstacles = [...fixObstacles, ...xObstacles, ...yObstacles]

  const currentSnakeCell: [number, number] = [
    snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX,
    snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY,
  ]
  const nextSnakeCell: [number, number] = [
    snakeHead.snakeHeadCoordX,
    snakeHead.snakeHeadCoordY,
  ]

  for (const pos of obstacles) {
    ;[snakeHead, contact] = snakeCoordCompare(snakeHead, pos, contact)
    if (contact) {
      snakeHead = getBreaksObstacles()
        ? isBroken(snakeHead)
        : isContact(snakeHead, 'obstacle')
      break
    }
    // if (contact)
    // console.log(snakeHead.snakeHeadCoordX, pos[0], snakeHead.snakeHeadCoordY, pos[1])
  }

  if (!contact && !getBreaksObstacles()) {
    const xSteps = getObstaclesStepX()
    for (let i = 0; i < xObstacles.length; i++) {
      const obstacle = xObstacles[i]
      const step = xSteps[i] ?? 0
      if (step === 0) continue

      const currentObstacleCell: [number, number] = [obstacle[0], obstacle[1]]
      const nextObstacleCell: [number, number] = [obstacle[0] + step, obstacle[1]]
      if (
        isSwapCollision(
          currentSnakeCell,
          nextSnakeCell,
          currentObstacleCell,
          nextObstacleCell,
        )
      ) {
        snakeHead.snakeHeadCoordX = currentSnakeCell[0]
        snakeHead.snakeHeadCoordY = currentSnakeCell[1]
        snakeHead = isContact(snakeHead, 'obstacle')
        contact = true
        break
      }
    }
  }

  if (!contact && !getBreaksObstacles()) {
    const ySteps = getObstaclesStepY()
    for (let i = 0; i < yObstacles.length; i++) {
      const obstacle = yObstacles[i]
      const step = ySteps[i] ?? 0
      if (step === 0) continue

      const currentObstacleCell: [number, number] = [obstacle[0], obstacle[1]]
      const nextObstacleCell: [number, number] = [obstacle[0], obstacle[1] + step]
      if (
        isSwapCollision(
          currentSnakeCell,
          nextSnakeCell,
          currentObstacleCell,
          nextObstacleCell,
        )
      ) {
        snakeHead.snakeHeadCoordX = currentSnakeCell[0]
        snakeHead.snakeHeadCoordY = currentSnakeCell[1]
        snakeHead = isContact(snakeHead, 'obstacle')
        break
      }
    }
  }

  return snakeHead
}

export default snakeObstacleContactEvent
