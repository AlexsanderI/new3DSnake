/**
 * @module allContactEvents.ts Проверяет запрещенные контакты змейки
 *    @function allContactEvents Объединяет все запрещенные контакты змейки
 */
import { closeSnakeMouth } from '../../animations/snakeAnimation/headAnimations/foodEatenAnimation'
import { SnakeHeadCoord } from '../../types/snakeTypes'
import { getAmountOfFood } from '../food/amountOfFoodPerLevel'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getFoodCoord } from '../food/food'
import { checkMistake } from '../lives/isMistake'
import { stopTimer } from '../time/isTimer'
import snakeBorderContactEvent from './snakeBorderContactEvent'
import snakeHeadBodyContactEvent from './snakeHeadBodyContactEvent'
import { setDistanceFromSnakeToFood } from './snakeMovesTowardsFood'
import snakeObstacleContactEvent from './snakeObstacleContactEvent'

let isDistraintContact = false

export const setIsDistraintContact = (value: boolean) => {
  isDistraintContact = value
}

export const getIsDistraintContact = () => isDistraintContact

function isLastFoodCell(snakeHead: SnakeHeadCoord): boolean {
  const foodCoord = getFoodCoord()
  const isFoodCell =
    snakeHead.snakeHeadCoordX === foodCoord[0] &&
    snakeHead.snakeHeadCoordY === foodCoord[1]

  return isFoodCell && getCurrentFoodNumber() + 1 >= getAmountOfFood()
}

/**
 *  Тестирует контакт головы змейки с краями поля, препятствиями и своим телом
 *  @param snakeHead Текущие координаты головы змейки
 *  @description Если змейка касается запрещенного объекта, игра останавливается
 *  @returns новые координаты головы змейки, скорректированные при контакте
 */
function allContactEvents(snakeHead: SnakeHeadCoord): SnakeHeadCoord {
  let { ...newSnakeHeadCoord } = snakeHead
  let checkedSnakeHeadCoord = { ...newSnakeHeadCoord }
  if (isLastFoodCell(checkedSnakeHeadCoord)) {
    setIsDistraintContact(false)
    return checkedSnakeHeadCoord
  }

  checkedSnakeHeadCoord = snakeBorderContactEvent(checkedSnakeHeadCoord)
  checkedSnakeHeadCoord = snakeObstacleContactEvent(checkedSnakeHeadCoord)
  checkedSnakeHeadCoord = snakeHeadBodyContactEvent(checkedSnakeHeadCoord)

  if (checkMistake()) {
    closeSnakeMouth()
    stopTimer()
  }
  setIsDistraintContact(
    newSnakeHeadCoord.snakeHeadCoordX !== checkedSnakeHeadCoord.snakeHeadCoordX ||
      newSnakeHeadCoord.snakeHeadCoordY !== checkedSnakeHeadCoord.snakeHeadCoordY,
  )

  return checkedSnakeHeadCoord
}

export default allContactEvents
