/**
 * @module changeDirectionEvent.ts Управление змейкой с клавиатуры
 *    @var prohibitedMove Хранит параметры запрещенного обратного хода змейки
 *    @function changeDirectionEvent Отрабатывает нажатие клавиш
 */
import { Event } from '../../types/eventTypes'
import * as TIMER from '../time/isTimer'
import checkTimerStep from '../time/checkTimerStep'
import findLastMoveDirection from '../protocol/findLastMoveDirection'
import { getInterruptGame } from './interruptGameEvent'
import { checkPause } from './pauseEvent'
import { checkTimerWorking } from '../time/isTimer'
import { checkContact } from './isContact'
import { getSnakeBodyCoord, getSnakeHeadParams } from '../snake/snake'
import { getField } from '../field/fieldPerLevel'
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import { getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesYCoord } from '../obstacles/obstaclesY'
import snakeCoordCompare from './snakeCoordCompare'

/**
 * Проверяет, не заблокировано ли направление телом змейки, препятствиями или границами
 */
function isDirectionAvailable(dirName: 'X' | 'Y', dirValue: 1 | -1): boolean {
  const snakeHead = getSnakeHeadParams()
  const obstacles = [
    ...getObstaclesFixCoord(),
    ...getObstaclesXCoord(),
    ...getObstaclesYCoord(),
  ]
  const prohibitedCells = obstacles.concat(getSnakeBodyCoord().slice(1))

  let coord = [0, 0]
  if (dirName === 'X') {
    coord = [dirValue, 0]
  } else {
    coord = [0, dirValue]
  }

  let checkSnakePos = {
    ...snakeHead,
    snakeHeadCoordX: snakeHead.snakeHeadCoordX + coord[0],
    snakeHeadCoordY: snakeHead.snakeHeadCoordY + coord[1],
    snakeHeadStepX: coord[0],
    snakeHeadStepY: coord[1],
  }

  let contact = false
  prohibitedCells.forEach((pos) => {
    ;[checkSnakePos, contact] = snakeCoordCompare(checkSnakePos, pos, contact)
  })

  const outOfBounds =
    checkSnakePos.snakeHeadCoordX < 1 ||
    checkSnakePos.snakeHeadCoordX > getField() ||
    checkSnakePos.snakeHeadCoordY < 1 ||
    checkSnakePos.snakeHeadCoordY > getField()

  return !contact && !outOfBounds
}

/**
 * @var Новое направление головы змейки
 */
let newMoveDirection = ''
export const setNewMoveDirection = (move: string) => {
  newMoveDirection = move
}
export const getNewMoveDirection = (): string => newMoveDirection

/**
 * Изменяет направление движения змейки при нажатии клавиш со стрелками
 * @param e событие нажатия клавиши на клавиатуре
 * @description
 * 1. После паузы позволяет двигаться змейке в прежнем направлении
 * 2. Повтороное нажатие не отрабатывается
 * 3. Движение змейки в обратную сторону запрещено
 * 4. Отработка нажатия клавиши происходит внесением записи об этом в протокол
 * 5. Нажатие клавиши запускает игру
 * 6. При остановке змейки проверяет доступность направления (не в тело и не в препятствия)
 * @returns событие изменения направления движения змейки, или "пустое" событие
 */
export const changeDirectionEvent = (e: KeyboardEvent): Event => {
  const moveDirection = findLastMoveDirection()

  let newName = ''
  let newValue = 0

  if (!checkTimerWorking() || checkContact()) moveDirection.name = ''

  if (e.code === 'ArrowUp' && moveDirection.name !== 'Y') {
    if (!checkTimerWorking() && !isDirectionAvailable('Y', 1)) {
      return { name: '', value: 0 }
    }
    newName = 'Y'
    newValue = 1
    setNewMoveDirection('up')
  } else if (e.code === 'ArrowDown' && moveDirection.name !== 'Y') {
    if (!checkTimerWorking() && !isDirectionAvailable('Y', -1)) {
      return { name: '', value: 0 }
    }
    newName = 'Y'
    newValue = -1
    setNewMoveDirection('down')
  } else if (e.code === 'ArrowLeft' && moveDirection.name !== 'X') {
    if (!checkTimerWorking() && !isDirectionAvailable('X', -1)) {
      return { name: '', value: 0 }
    }
    newName = 'X'
    newValue = -1
    setNewMoveDirection('left')
  } else if (e.code === 'ArrowRight' && moveDirection.name !== 'X') {
    if (!checkTimerWorking() && !isDirectionAvailable('X', 1)) {
      return { name: '', value: 0 }
    }
    newName = 'X'
    newValue = 1
    setNewMoveDirection('right')
  }

  // if (newName === prohibitedMove.direction && newValue === prohibitedMove.step)
  //   return { name: '', value: 0 }
  if (newName !== '' && !checkPause()) TIMER.startTimer()
  const newEvent = Object.assign({}, { name: newName, value: newValue })

  return newEvent
}
