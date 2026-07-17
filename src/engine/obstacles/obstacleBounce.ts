/**
 * @module obstacleBounce.ts Отрабатывает отскок препятствия от другого объекта
 *    @function obstacleBounce Изменяет шаг отскочившего препятствия на обратный
 */
import { newObstacleStep } from '../../types/obstacleTypes'
/**
 * При касании препятствия с другим объектом изменяет его шаг на обратный
 * @param props аргументы, необходимые для вычисления отскока препятствия
 * @description для переданного функции препятствия:
 *      - определяет направление его движения (вверх/вниз, влево/вправо)
 *      - изменяет шаг на 1 или -1 в зависимости от направления движения
 * @returns измененный шаг отскочившего препятствия
 */
function obstacleBounce(props: newObstacleStep): number {
  const { i, twist, coord, step, cell } = props
  if (cell) {
    const [posX, posY] = cell
    const current = coord[i][twist[0]]
    const next = current + step[i]
    const cellPrimary = [posX, posY][twist[0]]
    const sameLane = coord[i][twist[1]] === [posX, posY][twist[1]]
    const movesPositive = step[i] > 0
    const movesNegative = step[i] < 0
    const reachedOrCrossed =
      (movesPositive && current < cellPrimary && next >= cellPrimary) ||
      (movesNegative && current > cellPrimary && next <= cellPrimary)

    if (sameLane && reachedOrCrossed) step[i] = step[i] * -1
  }
  return step[i]
}

export default obstacleBounce
