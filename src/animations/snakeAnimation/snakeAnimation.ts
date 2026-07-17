import checkTimerStep from '../../engine/time/checkTimerStep'
import { checkTimerWorking } from '../../engine/time/isTimer'
import type { PreviousStep } from '../../types/animationTypes'
import snakeBodyDiff from './bodyAnimations/snakeBodyDiff'
import * as LOCATION from './bodyAnimations/snakeBodyLocation'
import { snakeBodyMoving } from './bodyAnimations/snakeBodyMoving'
import { snakeBodyTurnaround } from './bodyAnimations/snakeBodyTurnaround'
import { snakeHeadLocation } from './headAnimations/snakeHeadLocation'
import { snakeHeadMoving } from './headAnimations/snakeHeadMoving'
import { snakeHeadTurnaround } from './headAnimations/snakeHeadTurnaround'
import { snakeStepSetting } from './snakeStepSetting'
/**
 * @var массив объектов с направлениями движения каждого
 * элемента змейки по осям X и Y. Исходное состояние массива
 * соответствует змейке на старте игры.
 */
const snakePreviousStepsArray: PreviousStep[] = []
/**
 * Управляет анимацией змейки, выполняя расчеты в правильном порядке:
 * 1. Вычисление направлений движения
 * 2. Настройка шагов анимации
 * 3. Обновление позиций головы и тела
 * 4. Обработка поворотов
 * @param delta - интервал рендера змейки, используется для управления скоростью
 * анимации
 */
export const snakeAnimation = (delta: number): void => {
  /**
   * @var массив объектов с направлениями движения каждого элемента змейки
   * по осям X и Y на текущем и предыдущем шагах.
   * В момент создания масива, текущие направления неизвестены, и поэтому
   * они приравниваются предыдущим. Длина массива равна текущей длине змейки
   */
  const initialSteps = getSnakePreviousStepsArray().map((step) => ({
    ...step,
    currentStepX: step.previousStepX,
    currentStepY: step.previousStepY,
  }))
  if (initialSteps.length === 0 || !checkTimerWorking() || checkTimerStep()) return
  LOCATION.getSnakeBodyLocation().forEach((_, i) => snakeBodyDiff(i))
  const steps = snakeStepSetting(initialSteps)
  LOCATION.updateSnakeBodyLocation()
  snakeHeadLocation(steps[0], delta)
  snakeHeadMoving(steps[0], delta)
  snakeBodyMoving(steps, delta)
  snakeBodyTurnaround()
  setSnakePreviousStepsArray(
    steps.map(({ currentStepX, currentStepY }) => ({
      previousStepX: currentStepX,
      previousStepY: currentStepY,
    })),
  )
}
/**
 * Устанавливает массив предыдущих шагов змейки
 * @param props - новый массив шагов для установки
 */
export const setSnakePreviousStepsArray = (props: PreviousStep[]): void => {
  snakePreviousStepsArray.splice(0, snakePreviousStepsArray.length, ...props)
}
/**
 * Возвращает текущий массив предыдущих шагов змейки
 * @returns readonly массив предыдущих шагов
 */
export const getSnakePreviousStepsArray = (): ReadonlyArray<PreviousStep> =>
  snakePreviousStepsArray
