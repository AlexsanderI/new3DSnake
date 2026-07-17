/**
 * @module cellCheck.ts Проверяет, является ли ячейка свободной
 *      @function cellCheck Возвращает true, если ячейка свободна
 */
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import { getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesYCoord } from '../obstacles/obstaclesY'
import { getFoodCoord } from '../food/food'
import { getSnakeBodyCoord } from '../snake/snake'

type CellCheckOptions = {
  ignoreSnakeReserveTail?: boolean
}
/**
 * Проверяет ячейку на наличие в ней объектов игрового поля
 * @param cell координаты проверяемой ячейки
 * @description ищет среди всех занятых ячеек проверяемую координату
 * @returns true, если ячейка свободна, false, если занята
 */
const cellCheck = (cell: number[], options: CellCheckOptions = {}): boolean => {
  const [cellX, cellY] = cell

  const bookedCells: number[][] = []
  const isCoord = (coord: unknown): coord is number[] =>
    Array.isArray(coord) &&
    coord.length === 2 &&
    coord.every((value) => typeof value === 'number')

  const addBookedCells = (coords?: any) => {
    coords?.forEach((coord: unknown) => {
      if (isCoord(coord)) bookedCells.push(coord)
    })
  }

  const foodCoord = getFoodCoord()
  if (isCoord(foodCoord)) bookedCells.push(foodCoord)

  addBookedCells(getObstaclesFixCoord())
  addBookedCells(getObstaclesYCoord())
  addBookedCells(getObstaclesXCoord())
  const snakeBody = getSnakeBodyCoord()
  const snakeBodyForCollision = options.ignoreSnakeReserveTail
    ? snakeBody.slice(0, -1)
    : snakeBody
  addBookedCells(snakeBodyForCollision)

  return bookedCells.every((coord) => coord[0] !== cellX || coord[1] !== cellY)
}

export default cellCheck
