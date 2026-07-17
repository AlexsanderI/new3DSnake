import { getCounterHead } from '../../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import { getDoubleScoresFood } from '../bonuses/bonusDoubleScoresFood'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getFoodScores } from '../food/food'
import { addEvent } from '../protocol/protocol'
import protocolExecutor from '../protocol/protocolExecutor'
import { getFoodEaten } from './snakeCatchesFoodEvent'

export function snakeFoodEaten() {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) {
    if (getFoodEaten()) {
      if (getDoubleScoresFood())
        addEvent({ name: 'bonus doubleScoresFood', value: getFoodScores() * 2 })
      protocolExecutor({
        name: 'food eaten',
        value: getCurrentFoodNumber() + 1,
      })
    }
  }
}
