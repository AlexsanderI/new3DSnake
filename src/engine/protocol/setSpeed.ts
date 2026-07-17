/**
 *  @module setSpeed.ts Управляет скоростью движения змейки
 *     @var snakeHeadSteps Сохраняет текущие шаги движения змейки
 *     @function setSpeed Задает интервал перерисовки игрового поля
 */
import { changeSnakeSpeed } from '../../animations/snakeAnimation/snakeSpeedSetting'
import { checkPause } from '../events/pauseEvent'
import { obstacleSpeedReset } from '../obstacles/obstacleSpeed'
import {
  clearStoppedSnakeDirection,
  getSnakeHeadParams,
  setSnakeHeadParams,
  setStoppedSnakeDirection,
} from '../snake/snake'
import checkTimerStep from '../time/checkTimerStep'
import * as TIMER from '../time/timerStepPerLevel'
/**
 * Текущие шаги движения змейки в виде [x, y]
 */
let snakeHeadSteps: number[] = [0, 0]
/**
 * Изменяет интервал перерисовки игрового поля на величину speed
 * @param speed Шаг изменения интервала перерисовки, может быть 1 или -1
 * @description
 *  - получает текущий интервал перерисовки
 *  - запускает новый цикл перемещения препятствий, скорость которых неизменна
 *  - все интервалы перерисовки, кроме крайних, меняет на величину шага
 *  - ограничивает минимальный интервал перерисовки 1, иначе это будет пауза
 *  - позволяет изменение максимальной скорости игры только на -1
 *  - запоминает шаги движения змейки перед ее остановкой на нулевой скорости
 *  - останавливает змейку на нулевой скорости, обнуляя шаги ее движения
 *  - возвращает шаги движения змейки при переходе от нулевой к первой скорости
 *  - позволяет изменение минимальной скорости игры только на 1
 */
function setSpeed(speed: number) {
  const maxSpeed = TIMER.getSpeedLimit()
  if (checkPause()) return
  const currentTimeStep = TIMER.getStep()
  obstacleSpeedReset()
  if (currentTimeStep > 0 && currentTimeStep < maxSpeed)
    TIMER.setTimerStep(
      currentTimeStep + speed === 0 ? currentTimeStep : currentTimeStep + speed
    )
  if (TIMER.getStep() === maxSpeed && speed < 0) TIMER.setTimerStep(maxSpeed - 1)
  if (currentTimeStep + speed === 0) {
    if (!checkTimerStep())
      snakeHeadSteps = [
        getSnakeHeadParams().snakeHeadStepX,
        getSnakeHeadParams().snakeHeadStepY,
      ]
    setStoppedSnakeDirection([snakeHeadSteps[0], snakeHeadSteps[1]])
    setSnakeHeadParams({
      ...getSnakeHeadParams(),
      snakeHeadStepX: 0,
      snakeHeadStepY: 0,
    })
  }
  if (currentTimeStep === 1 && speed > 0) {
    TIMER.setTimerStep(1)
    if (TIMER.getStep() === 1 && !checkTimerStep()) TIMER.setTimerStep(2)
    if (TIMER.getStep() === 1 && checkTimerStep())
      setSnakeHeadParams({
        ...getSnakeHeadParams(),
        snakeHeadStepX: snakeHeadSteps?.[0] ?? 0,
        snakeHeadStepY: snakeHeadSteps?.[1] ?? 0,
      })
    clearStoppedSnakeDirection()
  }
  changeSnakeSpeed(TIMER.getStep())
}

export default setSpeed
