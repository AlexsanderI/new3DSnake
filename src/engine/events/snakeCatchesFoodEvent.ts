/**
 *  @module snakeCatchesFoodEvent.ts Управляет контактом змейки с едой
 *     @void isFoodEaten Фиксирует момент поедания еды змейкой
 *     @function snakeCatchesFoodEvent Проверяет касание головы змейки с едой
 *     @function getFoodEaten Показывает, была ли съедена еда на текущем шаге
 */
import { getCounterHead } from '../../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import { getDoubleScoresFood } from '../bonuses/bonusDoubleScoresFood'
import { getCurrentFoodNumber, howMuchIsLeftToEat } from '../food/currentFoodNumber'
import { getFoodCoord, getFoodScores } from '../food/food'
import { getCurrentLevel } from '../levels/currentLevel'
import { addEvent } from '../protocol/protocol'
import protocolExecutor from '../protocol/protocolExecutor'
import { getSnakeHeadParams } from '../snake/snake'
import { checkContact } from './isContact'
/**
 * Контроль контакта головы змейки с едой, true, если есть, и false, если нет
 */
let isFoodEaten = false
/**
 *  При контакте змейки с едой создает событие и запускает его обработку
 */
export function snakeCatchesFoodEvent(): void {
  const [counterHeadX, counterHeadY] = getCounterHead()
  // if (counterHeadX === 0 && counterHeadY === 0) {
  const snakeHead = getSnakeHeadParams()
  const foodCoord = getFoodCoord()
  setFoodEaten(false)
  if (
    snakeHead.snakeHeadCoordX === foodCoord[0] &&
    snakeHead.snakeHeadCoordY === foodCoord[1]
  ) {
    setFoodEaten(true)

    if (getDoubleScoresFood())
      addEvent({ name: 'bonus doubleScoresFood', value: getFoodScores() * 2 })
    protocolExecutor({
      name: 'food eaten',
      value: getCurrentFoodNumber() + 1,
    })
    if (howMuchIsLeftToEat() === 0) {
      protocolExecutor({
        name: 'level is complete',
        value: getCurrentLevel(),
      })
    }
  }
}

export function setFoodEaten(eaten: boolean) {
  isFoodEaten = eaten
}

export function getFoodEaten(): boolean {
  return isFoodEaten
}
