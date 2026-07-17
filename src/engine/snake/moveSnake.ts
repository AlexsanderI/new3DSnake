/**
 * @module moveSnake.ts Управляет движением змейки
 *    @function moveSnake Двигает змейку по игровому полю
 */
import { getCounterHead } from '../../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import { checkTimerWorking } from '../time/isTimer'
import { advanceSnake } from './advanceSnake'
/**
 * Двигает змейку по игровому полю
 * @description
 * 1. Проверяет, достигла ли голова змейки целевой позиции
 * 2. Если да и таймер активен, вызывает advanceSnake для обновления положения змейки
 */
function moveSnake(): void {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0 && checkTimerWorking()) advanceSnake()
}

export default moveSnake
