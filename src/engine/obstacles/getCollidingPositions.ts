/**
 * @module hotObstaclesPositions.ts Вычисляет "горячие" позиции, на которые движется
 *                                  несколько препятствий
 *  @function hotObstaclesPositions Формирует массив "горячих" позиций препятствий
 */

import { getSnakeHeadParams } from '../snake/snake'
import { getObstaclesStepX, getObstaclesXCoord } from './obstaclesX'
import { getObstaclesStepY, getObstaclesYCoord } from './obstaclesY'
import checkObstaclePosition from './checkObstaclePosition'
import { getFoodCoord } from '../food/food'
import { getObstaclesFixCoord } from './obstaclesFix'

/**
 * На основе данных о всех движущихся препятствиях формирует массив их "горячих"
 * позиций.
 * @description для создания массива "горячих" позиций:
 *      - использует координаты и шаг головы змейки,
 *      - использует координаты и шаг препятствий, движущихся по горизонтали
 *      - использует координаты и шаг препятствий, движущихся по вертикали
 *      - для каждого препятствия проверяет доступность следующей позиции
 *      - если следующая позиция занята, использует позицию с противоположной стороны
 *      - добавляет вычисленные позиции в массив "горячих" позиций
 *      - удаляет дублирующиеся позиции из массива
 * @returns массив "горячих" позиций на игровом поле.
 */

/**
 * Compute all next-step positions for moving objects (snake head + all obstacles)
 * and return only coordinates that collide (appear more than once).
 *
 * ВАЖНО: Функция вычисляет ЖЕЛАЕМЫЕ позиции каждого объекта (по текущему шагу).
 * Реальные позиции могут отличаться из-за отскоков и проверок в moveObstacles.
 * Эта функция только обнаруживает ПОТЕНЦИАЛЬНЫЕ столкновения, которые нужно обработать.
 *
 * @returns array of coordinates where multiple objects want to be on the next step
 */
export const getCollidingPositions = (): number[][] => {
  const { snakeHeadCoordX, snakeHeadCoordY, snakeHeadStepX, snakeHeadStepY } =
    getSnakeHeadParams()
  const obstaclesXCoord = getObstaclesXCoord()
  const obstaclesYCoord = getObstaclesYCoord()
  const obstaclesStepX = getObstaclesStepX()
  const obstaclesStepY = getObstaclesStepY()

  // Array to store all desired next-step positions (may contain duplicates)
  const allPositions: number[][] = []

  // Add snake head's desired next position
  allPositions.push([snakeHeadCoordX + snakeHeadStepX, snakeHeadCoordY + snakeHeadStepY])

  // Add desired next positions for horizontally moving obstacles
  // Вычисляем желаемую позицию БЕЗ проверок - система отскоков уже проверит доступность
  for (let i = 0; i < obstaclesXCoord.length; i++) {
    const nextPos = [obstaclesXCoord[i][0] + obstaclesStepX[i], obstaclesXCoord[i][1]]
    allPositions.push(nextPos)
  }

  // Add desired next positions for vertically moving obstacles
  for (let i = 0; i < obstaclesYCoord.length; i++) {
    const nextPos = [obstaclesYCoord[i][0], obstaclesYCoord[i][1] + obstaclesStepY[i]]
    allPositions.push(nextPos)
  }

  // Count occurrences of each coordinate
  const coordMap = new Map<string, number>()
  for (const pos of allPositions) {
    const key = `${pos[0]},${pos[1]}`
    coordMap.set(key, (coordMap.get(key) ?? 0) + 1)
  }

  // Extract only coordinates where multiple objects want to go
  // Эти позиции требуют обработки отскоков
  const collidingPositions: number[][] = []
  coordMap.forEach((count, key) => {
    if (count > 1) {
      const [x, y] = key.split(',').map(Number)
      collidingPositions.push([x, y])
    }
  })

  return collidingPositions
}
