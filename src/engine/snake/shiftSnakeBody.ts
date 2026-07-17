/**
 * @module shiftSnakeBody.ts Сдвигает координаты тела змейки
 *    @function shiftSnakeBody Сдвигает координаты тела змейки и вставляет новую позицию головы
 */
import { setSnakeBodyCoord } from './snake'

/**
 * Сдвигает координаты тела змейки, вставляет новую позицию головы и сохраняет изменения.
 * @param bodyCoords Массив координат тела змейки
 * @param headX X координата головы
 * @param headY Y координата головы
 */
export function shiftSnakeBody(
  bodyCoords: number[][],
  headX: number,
  headY: number
): void {
  const newBody = [...bodyCoords]
  for (let i = newBody.length - 1; i > 0; i--) {
    newBody[i] = newBody[i - 1]
  }
  newBody[0] = [headX, headY]
  setSnakeBodyCoord(newBody)
}
