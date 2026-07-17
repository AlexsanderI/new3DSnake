/**
 *  @module snakeCoordCompare.ts Управляет контактами головы змейки
 *     @function snakeCoordCompare Сравнивает координаты препятствий и головы змейки
 */
import { SnakeHeadCoord, HeadCompare } from '../../types/snakeTypes'
import { didSnakeReachCellOnStep } from './snakeStepCollision'
/**
 * Сравнивает координаты головы змейки с заданной позицией
 * @param snakeHead Параметры головы змейки
 * @param pos Заданная позиция
 * @param contact Маркер, изменяющий значение при совпадении координат
 * @description Если координаты совпадают, голова змейки делает шаг назад
 * @returns массив с параметрами головы змейки и маркером, тип Compare
 */
function snakeCoordCompare(
  snakeHead: SnakeHeadCoord,
  pos: number[],
  contact: boolean,
): HeadCompare {
  const isCollision = didSnakeReachCellOnStep(snakeHead, pos)
  contact = contact || isCollision
  if (isCollision) {
    snakeHead.snakeHeadCoordY = snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY
    snakeHead.snakeHeadCoordX = snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX
  }

  return [snakeHead, contact]
}

export default snakeCoordCompare
