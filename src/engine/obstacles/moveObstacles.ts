/**
 * @module moveObstacles.ts Перемещает препятствия по игровому полю
 *    @function moveObstacles Управляет движением среди других объектов на поле
 */
import { checkTimerWorking } from '../time/isTimer'
import selectObstacleDirection from './selectObstacleDirection'
import * as X from './obstaclesX'
import * as Y from './obstaclesY'
import checkObstaclePosition from './checkObstaclePosition'
import setObstacleStep, { resetCollidingPositionsCache } from './setObstacleStep'
import { getSnakeHeadParams, getStoppedSnakeDirection } from '../snake/snake'
import { getStep } from '../time/timerStepPerLevel'
import { getField } from '../field/fieldPerLevel'

// хранит ненулевые шаги препятствий отдельно для X и Y, чтобы избежать коллизий индексов
const prevStepsX: number[] = []
const prevStepsY: number[] = []
const oscillatingStationaryX: number[][] = []
const oscillatingStationaryY: number[][] = []

export function getOscillatingStationaryX(): number[][] {
  return oscillatingStationaryX.map((coord) => [...coord])
}

export function getOscillatingStationaryY(): number[][] {
  return oscillatingStationaryY.map((coord) => [...coord])
}

function isStoppedSnakeFrontCell(pos: number[]): boolean {
  const stoppedDirection = getStoppedSnakeDirection()
  if (!stoppedDirection) return false

  const { snakeHeadCoordX, snakeHeadCoordY } = getSnakeHeadParams()
  return (
    pos[0] === snakeHeadCoordX + stoppedDirection[0] &&
    pos[1] === snakeHeadCoordY + stoppedDirection[1]
  )
}
/**
 * Изменяет координаты препятствий и их шаг
 * @description
 *  Для каждого направления движения препятствий во время игры:
 *      - получает координаты препятствий и шаг каждого из них
 *      - изменяет шаг на обратный при контакте препятствий с другими объектами
 *      - останавливает препятствия при приближении головы змейки
 *      - изменяет координаты препятствий на величину шага
 * @param type - направление движения препятствия, x или y
 */
function moveObstacles(type: string, forceMove = false): void {
  const gridSize = getField()
  // фиксированный радиус останова препятствий (не зависит от скорости змейки)
  const stopDistance = getStep() + 2
  const isSnakeMoving =
    getSnakeHeadParams().snakeHeadStepX !== 0 || getSnakeHeadParams().snakeHeadStepY !== 0

  // Reset cache at the start of each frame
  resetCollidingPositionsCache()

  // Получаем копии данных направления, будем работать с ними и записать результат разом
  const selected = selectObstacleDirection(type)
  // coordCopy: глубокая копия вложенных массивов, чтобы избегать мутаций оригинала
  const coordCopy: number[][] = selected.coord.map((c) => [...c])
  const stepCopy: number[] = [...selected.step]
  // if (type === 'y') console.log('move: ', coordCopy[0])

  if (!checkTimerWorking() && !forceMove) return

  const twist = type === 'y' ? [1, 0] : [0, 1]

  for (let i = 0; i < coordCopy.length; i++) {
    const initialCoord = [...coordCopy[i]]
    const initialStep = stepCopy[i]
    // рассчитываем новый шаг с учётом всех столкновений, работаем с копией stepCopy
    stepCopy[i] = setObstacleStep({ i, twist, coord: coordCopy, step: stepCopy })
    let nextStoredStep = stepCopy[i]
    // сохраняем последний ненулевой шаг в массив, специфичный для типа
    const prev = type === 'x' ? prevStepsX : prevStepsY
    if (stepCopy[i] !== 0) prev[i] = stepCopy[i]
    // рассчёт предполагаемой новой позиции (без изменения оригинала)
    const probePos = [...coordCopy[i]]
    probePos[twist[0]] += stepCopy[i]

    // если позиция недопустима — останавливаем
    const hitsStoppedSnakeFrontCell = isStoppedSnakeFrontCell(probePos)
    let newStep = !checkObstaclePosition(probePos) ? 0 : stepCopy[i]

    if (hitsStoppedSnakeFrontCell) {
      const reversedStep = stepCopy[i] * -1
      const reversedProbePos = [...coordCopy[i]]
      reversedProbePos[twist[0]] += reversedStep

      nextStoredStep = reversedStep
      stepCopy[i] = reversedStep

      if (
        reversedStep !== 0 &&
        checkObstaclePosition(reversedProbePos) &&
        !isStoppedSnakeFrontCell(reversedProbePos)
      ) {
        newStep = reversedStep
        prev[i] = reversedStep
      } else {
        newStep = 0
      }
    }

    // Блокируем "проезд сквозь" при одновременном обмене клетками двух ежей.
    // Это особенно заметно, когда один еж разворачивается, а второй продолжает движение.
    if (newStep !== 0) {
      const currentPrimary = coordCopy[i][twist[0]]
      const currentSecondary = coordCopy[i][twist[1]]
      const nextPrimary = currentPrimary + newStep
      const isSwapCrossing = coordCopy.some((otherCoord, j) => {
        if (j === i) return false
        if (otherCoord[twist[1]] !== currentSecondary) return false

        const otherCurrentPrimary = otherCoord[twist[0]]
        const otherStep = stepCopy[j]
        const otherNextPrimary = otherCurrentPrimary + otherStep

        return nextPrimary === otherCurrentPrimary && otherNextPrimary === currentPrimary
      })

      if (isSwapCrossing) {
        newStep = 0
      }
    }

    // если змейка близко и движется — останавливаем препятствие
    if (
      Math.abs(coordCopy[i][0] - getSnakeHeadParams().snakeHeadCoordX) < stopDistance &&
      Math.abs(coordCopy[i][1] - getSnakeHeadParams().snakeHeadCoordY) < stopDistance &&
      isSnakeMoving
    ) {
      newStep = 0
    } else {
      // если змейка не близко и препятствие было остановлено — возвращаем предыдущий шаг
      if (newStep === 0 && !hitsStoppedSnakeFrontCell) {
        const prev = type === 'x' ? prevStepsX : prevStepsY
        if (prev[i] !== undefined) {
          const restoredProbePos = [...coordCopy[i]]
          restoredProbePos[twist[0]] += prev[i]
          // Возвращаем предыдущий шаг только если он снова ведет в допустимую клетку.
          // Иначе препятствие должно остаться на месте, чтобы не проскочить сквозь объект.
          if (checkObstaclePosition(restoredProbePos)) {
            // В этот тик только восстанавливаем шаг, а само движение переносим
            // на следующий тик. Это дает движку шанс учесть встречные траектории
            // через getCollidingPositions до фактического смещения.
            nextStoredStep = prev[i]
            newStep = 0
          }
        }
      }
    }

    // применяем шаг к копии координат
    coordCopy[i][twist[0]] += newStep
    stepCopy[i] = nextStoredStep

    const obstacleOscillatesInPlace =
      initialStep !== 0 &&
      coordCopy[i][0] === initialCoord[0] &&
      coordCopy[i][1] === initialCoord[1] &&
      nextStoredStep === initialStep * -1

    const stationaryOscillating = type === 'x' ? oscillatingStationaryX : oscillatingStationaryY
    stationaryOscillating[i] = obstacleOscillatesInPlace ? [...coordCopy[i]] : []
  }

  // Записываем обновлённые массивы в соответствующие модули одним присваиванием
  if (type === 'x') {
    X.setObstaclesStepX(stepCopy)
    X.setObstaclesXCoord(coordCopy)
  } else {
    Y.setObstaclesStepY(stepCopy)
    Y.setObstaclesYCoord(coordCopy)
  }
  // console.log(
  //   'engine X: ',
  //   Math.round(X.getObstaclesXCoord()[0][0] - gridSize / 2) - 1,
  //   // 'engine Y: ',
  //   // Y.getObstaclesYCoord()[1],
  // )
}

export default moveObstacles
