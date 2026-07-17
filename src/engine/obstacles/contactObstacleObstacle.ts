/**
 * @module contactObstacleObstacle.ts Управляет контактом препятствий между собой
 *    @function contactObstacleObstacle Изменяет направление движение препятствий
 */
import { obstacleContactProps } from '../../types/obstacleTypes'
import { getObstaclesFixCoord } from './obstaclesFix'
import { getObstaclesXCoord } from './obstaclesX'
import { getObstaclesYCoord } from './obstaclesY'
import obstacleBounce from './obstacleBounce'
/**
 * При контакте препятствий меняет направление их движения
 * @param props объект с аргументами функции, проверяющей контакты препятствий
 * @description
 * @returns измененный шаг препятствия, коснувшегося другого препятствия
 */
function contactObstacleObstacle(props: obstacleContactProps): number {
  const { i, step } = props
  const initialStep = step[i]
  const allCells = [
    ...getObstaclesFixCoord(),
    ...getObstaclesXCoord(),
    ...getObstaclesYCoord(),
  ]
  for (const pos of allCells) {
    step[i] = obstacleBounce({ ...props, cell: pos })
    // Останавливаемся после первого эффективного разворота,
    // чтобы последующие ячейки не отменили его вторым инвертом.
    if (step[i] !== initialStep) break
  }
  return step[i]
}

export default contactObstacleObstacle
