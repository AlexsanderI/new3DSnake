/**
 * @module setSnakePosition.ts Управляет позицией змейки
 *    @function setSnakePosition Контролирует количество шагов головы 3D змейки по X и Y
 */
import { checkTimerWorking } from '../time/isTimer'
import { getTimerStep } from '../time/timerStepPerLevel'
/**
 * тип, описывающий счётчик шагов головы 3D змейки по X и Y
 * при её движении от центра одной клетки к центру другой
 */
type positionCounter = {
  counterX: number
  counterY: number
}
let counter = 0
let moveSpeed = 1
const FPS = 60
/**
 * Контролирует количество шагов головы 3D змейки по X и Y,
 * ограничивая их пределами межклеточного расстояния.
 * Когда counter превышает 1 это означает, что межклеточное
 * расстояние пройдено и счетчик обнуляется.
 * @param props текущее количество шагов головы 3D змейки
 * @returns количество шагов головы 3D змейки после контроля
 */
export const setSnakePosition = (props: positionCounter): positionCounter => {
  let { counterX, counterY } = props
  const maxCount = FPS / moveSpeed
  if (checkTimerWorking()) {
    counterX = counter >= maxCount ? 0 : counterX
    counterY = counter >= maxCount ? 0 : counterY
  }
  if (counterX === 0 && counterY === 0) {
    moveSpeed = getTimerStep()
    counter = 0
  } else {
    counter++
  }

  return { counterX, counterY }
}
