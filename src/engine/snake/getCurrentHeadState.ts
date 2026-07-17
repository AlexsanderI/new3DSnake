/**
 * @module getCurrentHeadState.ts Получает текущие координаты головы змейки
 *    @function getCurrentHeadState Возвращает текущие координаты и шаги головы змейки
 */
import { getPositionHead } from '../../animations/snakeAnimation/headAnimations/snakeHeadProps'
import { SnakeHeadCoord } from '../../types/snakeTypes'
import { getField } from '../field/fieldPerLevel'
import * as SNAKE from './snake'
/**
 * Возвращает текущие координаты головы змейки в координатах сетки поля
 * @returns {SnakeHeadCoord} Текущие координаты и шаги головы змейки
 */
export function getCurrentHeadState(): SnakeHeadCoord {
  const fieldSize = getField()
  const [positionX, positionY] = getPositionHead()
  const { snakeHeadStepX, snakeHeadStepY } = SNAKE.getSnakeHeadParams()
  const centerOffset = (fieldSize + 1) / 2

  return {
    snakeHeadCoordX: centerOffset + Math.round(positionX),
    snakeHeadCoordY: centerOffset + Math.round(positionY),
    snakeHeadStepX,
    snakeHeadStepY,
  }
}
