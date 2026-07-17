/**
 * @module contactObstacleHotPosition.ts Управляет препятствиями возле "горячих"
 *                                       позиций
 *  @function contactObstacleHotPosition Изменяет направление движение препятствий
 */
import { obstacleContactProps } from '../../types/obstacleTypes'
import { getCollidingPositions } from './getCollidingPositions'
import obstacleBounce from './obstacleBounce'

/**
 * При нахождении препятствий рядом с "горячими" позициями меняет направление их
 * движения
 * @param props объект с аргументами функции, проверяющей контакты препятствий
 * @description Использует предвычисленные "горячие" позиции (collidingPositions)
 *              для избежания повторного пересчета при каждом вызове.
 *              Инвертирует шаг только один раз, даже если препятствие совпадает
 *              с несколькими позициями.
 * @returns измененный шаг отскочившего препятствия
 */
function contactObstacleCollidingPosition(props: obstacleContactProps): number {
  const { i, step } = props
  const initialStep = step[i]

  for (const pos of getCollidingPositions()) {
    step[i] = obstacleBounce({ ...props, cell: pos })
    if (step[i] !== initialStep) break
  }

  return step[i]
}

export default contactObstacleCollidingPosition
