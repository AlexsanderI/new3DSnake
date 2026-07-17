/**
 *  @module foodEaten.ts Управляет игрой после поедания еды змейкой
 *     @function foodEaten Изменяет параметры игры при поедании еды
 */
import { getDoubleScoresFood } from '../bonuses/bonusDoubleScoresFood'
import { getStopsGrowing } from '../bonuses/bonusSnakeStopsGrowing'
import { setFoodEaten } from '../events/snakeCatchesFoodEvent'
import { getFoodScores } from '../food/food'
import setFood from '../food/setFood'
import { setScores } from '../scores/scores'
import * as SNAKE from '../snake/snake'
import { syncSnakeGrowthTail } from '../../animations/snakeAnimation/bodyAnimations/syncSnakeGrowthTail'
/**
 * Выводит новую еду, задает вознаграждение, добавляет длину змейке, если можно
 */
function foodEaten() {
  setFood(1)
  setScores(getDoubleScoresFood() ? getFoodScores() * 2 : getFoodScores())
  if (!getStopsGrowing()) {
    const snakeLength = SNAKE.getSnakeBodyCoord().length
    const xDef =
      SNAKE.getSnakeBodyCoord()[snakeLength - 2][0] -
      SNAKE.getSnakeBodyCoord()[snakeLength - 1][0]
    const yDef =
      SNAKE.getSnakeBodyCoord()[snakeLength - 2][1] -
      SNAKE.getSnakeBodyCoord()[snakeLength - 1][1]
    const xNewCoord = SNAKE.getSnakeBodyCoord()[snakeLength - 1][0] - xDef
    const yNewCoord = SNAKE.getSnakeBodyCoord()[snakeLength - 1][1] - yDef
    SNAKE.addSnakeBodyCoord([xNewCoord, yNewCoord])
    syncSnakeGrowthTail(SNAKE.getSnakeBodyCoord(), snakeLength)
  }
  // moveSnake();
}

export default foodEaten
