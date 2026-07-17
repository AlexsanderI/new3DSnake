/**
 * @module contactSnakeHeadObstacle.ts Управляет контактом препятствий с головой змейки
 *    @function contactSnakeHeadObstacle Изменяет направление движения препятствий
 */
import { obstacleContactProps } from '../../types/obstacleTypes'
import { getSnakeHeadParams } from '../snake/snake'
import obstacleBounce from './obstacleBounce'

/**
 * При контакте препятствий с текущей или следующей клеткой головы
 * меняет направление их движения.
 */
function contactSnakeHeadObstacle(props: obstacleContactProps): number {
  const { i, step } = props
  const initialStep = step[i]
  const { snakeHeadCoordX, snakeHeadCoordY, snakeHeadStepX, snakeHeadStepY } =
    getSnakeHeadParams()

  const protectedCells: [number, number][] = [[snakeHeadCoordX, snakeHeadCoordY]]
  const nextHeadCell: [number, number] = [
    snakeHeadCoordX + snakeHeadStepX,
    snakeHeadCoordY + snakeHeadStepY,
  ]

  if (
    nextHeadCell[0] !== snakeHeadCoordX ||
    nextHeadCell[1] !== snakeHeadCoordY
  ) {
    protectedCells.push(nextHeadCell)
  }

  for (const cell of protectedCells) {
    step[i] = obstacleBounce({ ...props, cell })
    if (step[i] !== initialStep) break
  }

  return step[i]
}

export default contactSnakeHeadObstacle
