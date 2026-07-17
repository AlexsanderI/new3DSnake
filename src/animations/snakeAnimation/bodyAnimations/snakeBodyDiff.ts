import { getSnakeBodyCoord, getSnakeHeadParams } from '../../../engine/snake/snake'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import { getSnakeBodyLocation } from './snakeBodyLocation'
import { getDiff, setDiff } from './snakeDiff'
/**
 * Рассчитывает направление движения одного элемента змейки с номером index
 * по осям X и Y. Сохраняет полученные значения в модуле snakeDiffs.ts
 * @param index - номер элемента змейки
 */
function snakeBodyDiff(index: number) {
  // if (getSnakeBodyCoord().length - 1 === index) return
  // получаем текущие направления движения расчетного элемента змейки
  let { diffX, diffY } = getDiff()[index]
  // Расчет производится только в узлах сетки игрового поля
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) {
    // Расчет производится только при движении змейки
    if (
      getSnakeHeadParams().snakeHeadStepX !== 0 ||
      getSnakeHeadParams().snakeHeadStepY !== 0
    )
      if (index !== 0) {
        // для всех элементов змейки, кроме головы, находим направления движения
        // по оси X как разность координат расчетного элемента змейки и соседнего
        // с ним со стороны головы по этой оси.

        diffX = getSnakeBodyLocation()[index - 1][0] - getSnakeBodyLocation()[index][0]
        // по оси Y, находим разность координат расчетного элемента змейки и соседнего
        // с ним со стороны головы по этой оси.
        diffY = getSnakeBodyLocation()[index - 1][1] - getSnakeBodyLocation()[index][1]
      } else {
        // Для головы направление движения задается данными из движка
        diffX =
          getSnakeHeadParams().snakeHeadStepX === -diffX
            ? diffX
            : getSnakeHeadParams().snakeHeadStepX
        diffY =
          getSnakeHeadParams().snakeHeadStepY === -diffY
            ? diffY
            : getSnakeHeadParams().snakeHeadStepY
      }

    // Сохраняем расчётные значения
    setDiff({ diffX, diffY }, index)
  }
}

export default snakeBodyDiff
