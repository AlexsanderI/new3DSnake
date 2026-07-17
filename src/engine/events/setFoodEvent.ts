/**
 * @module setFoodEvent.ts Генерирует координаты еды
 *    @function setFoodEvent Каждая еда занимает отдельную свободную ячейку
 */
import getFreeCell from '../field/getFreeCell'
import { getField } from '../field/fieldPerLevel'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getAmountOfFood } from '../food/amountOfFoodPerLevel'
import * as SNAKE from '../snake/snake'
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import { getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesYCoord } from '../obstacles/obstaclesY'
import * as FOOD from '../food/food'
import { addEvent } from '../protocol/protocol'

function isAppleSpawnCellValid(cell: [number, number]): boolean {
  const [x, y] = cell
  const fieldSize = getField()
  const fixedObstacles = new Set(
    getObstaclesFixCoord().map(([obstacleX, obstacleY]) => `${obstacleX}:${obstacleY}`)
  )
  const neighbors: [number, number][] = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]

  let blockedSides = 0

  for (const [neighborX, neighborY] of neighbors) {
    const isBorder =
      neighborX < 1 ||
      neighborX > fieldSize ||
      neighborY < 1 ||
      neighborY > fieldSize

    if (isBorder || fixedObstacles.has(`${neighborX}:${neighborY}`)) {
      blockedSides += 1
    }
  }

  return blockedSides <= 2
}

/**
 * Генерирует координаты X и Y текущей еды, заносит событие в протокол
 */
function setFoodEvent(): void {
  const booking: number[][] = []

  if (getCurrentFoodNumber() <= getAmountOfFood()) {
    const foodCell = getFreeCell(
      booking.concat(
        getObstaclesFixCoord(),
        getObstaclesXCoord(),
        getObstaclesYCoord(),
        SNAKE.getSnakeBodyCoord()
      ),
      isAppleSpawnCellValid
    )

    if (!foodCell) {
      console.log('WARNING! Unable to set food: no valid free cells available')
      return
    }

    const [foodX, foodY] = foodCell
    FOOD.setFoodCoord([foodX, foodY])
    addEvent({
      name: 'set food',
      value: FOOD.getFoodCoord()[0] + ':' + FOOD.getFoodCoord()[1],
    })
  }
}

export default setFoodEvent
