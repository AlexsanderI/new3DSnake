/**
 * @module getPotentialHeadState.ts Вычисляет потенциальные координаты головы в координатах сетки поля
 *   @function getPotentialHeadState Вычисляет потенциальные координаты головы змейки
 */
import { SnakeHeadCoord } from '../../types/snakeTypes'
/**
 * Получает потенциальное состояние головы змейки
 * @param currentHead - текущее состояние головы змейки
 * @returns новое состояние головы змейки
 */
export function getPotentialHeadState(currentHead: SnakeHeadCoord): SnakeHeadCoord {
  return {
    snakeHeadCoordX: currentHead.snakeHeadCoordX + currentHead.snakeHeadStepX,
    snakeHeadCoordY: currentHead.snakeHeadCoordY + currentHead.snakeHeadStepY,
    snakeHeadStepX: currentHead.snakeHeadStepX,
    snakeHeadStepY: currentHead.snakeHeadStepY,
  }
}
