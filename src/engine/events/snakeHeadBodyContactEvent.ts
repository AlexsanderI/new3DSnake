/**
 *  @module snakeHeadBodyContactEvent.ts Управляет контактом головы змейки с телом
 *     @function snakeHeadBodyContactEvent Создает событие контакт змейки с собой
 */
import { SnakeHeadCoord } from '../../types/snakeTypes'
import { isContact } from './isContact'
import * as SNAKE from '../snake/snake'
import { didSnakeReachCellOnStep } from './snakeStepCollision'
/**
 * При контакте змейки с самой собой останавливает движение и создает событие
 * @param snakeHead
 * @returns Измененные в результате контакта параметры головы змейки
 */
function snakeHeadBodyContactEvent(snakeHead: SnakeHeadCoord): SnakeHeadCoord {
  const snakeBody = SNAKE.getSnakeBodyCoord()
  const visibleTailIndex = snakeBody.length - 2
  const reserveTailIndex = snakeBody.length - 1
  for (let index = 0; index < snakeBody.length; index++) {
    const pos = snakeBody[index]
    if (
      index !== 0 &&
      index !== visibleTailIndex &&
      index !== reserveTailIndex &&
      didSnakeReachCellOnStep(snakeHead, pos)
    ) {
      snakeHead.snakeHeadCoordY = snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY
      snakeHead.snakeHeadCoordX = snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX
      isContact(snakeHead, 'oneself')
      break
    }
  }

  return snakeHead
}

export default snakeHeadBodyContactEvent
