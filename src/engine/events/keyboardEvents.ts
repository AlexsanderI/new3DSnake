/**
 *  @module keyboardEvents.ts Управляет нажатием клавиш на клавиатуре
 *     @function keyboardEvents Переводит нажатие клавиш в события игры
 */
import * as RENDER from '../render/isRender'
import { changeDirectionEvent } from './changeDirectionEvent'
import { checkPause, keyboardPauseEvent } from './pauseEvent'
import * as TIMER from '../time/isTimer'
import speedEvent from './speedEvent'
import { checkMistake } from '../lives/isMistake'
import { getTimer } from '../time/timer'
import protocolExecutor from '../protocol/protocolExecutor'
import { howMuchIsLeftToEat } from '../food/currentFoodNumber'
import findLastMoveDirection from '../protocol/findLastMoveDirection'
import { getProtocol } from '../protocol/protocol'
import { getSnakeHeadParams } from '../snake/snake'
import { getIsDistraintContact } from './allContactEvents'
import noMoves from './noMovesEvent'

const isArrowKey = (code: string): boolean => {
  return (
    code === 'ArrowUp' ||
    code === 'ArrowDown' ||
    code === 'ArrowLeft' ||
    code === 'ArrowRight'
  )
}

// import { checkExecution } from "../protocol/protocolExecutor";
/**
 * Следит за нажатием клавиш со стрелками и Space
 * @param e событие нажатия клавиши на клавиатуре
 * @returns прерывает выполнение функции, если нажата неиспользуемая клавиша
 */
function keyboardEvents(e: KeyboardEvent) {
  // if (getProtocol()[getProtocol().length - 1]?.name === 'life lost') {
  //   console.log(
  //     'life lost',
  //     getProtocol()[getProtocol().length - 3]?.name,
  //     getProtocol()[getProtocol().length - 3]?.value,
  //     findLastMoveDirection(),
  //     getIsDistraintContact(),
  //   )
  // }
  if (
    isArrowKey(e.code) &&
    checkMistake() &&
    !TIMER.checkTimerWorking() &&
    noMoves(getSnakeHeadParams()) &&
    getProtocol()[getProtocol().length - 1]?.name !== 'game over'
  ) {
    protocolExecutor({ name: 'game over', value: 'no moves' })
    RENDER.renderNotComplete()
    return
  }

  const newDirection = changeDirectionEvent(e)
  const newSpeed = speedEvent(e)
  const pause = keyboardPauseEvent(e)

  // findLastMoveDirection().name !== "" ? keyboardPauseEvent(e) : false;
  if (!pause && newDirection.name !== '') TIMER.startTimer()
  if ((newDirection.name === '' && newSpeed.name === '') || howMuchIsLeftToEat() === 0)
    return
  if ((TIMER.checkTimerWorking() || !checkMistake() || getTimer() === 0) && !checkPause())
    newDirection.name !== '' ? protocolExecutor(newDirection) : protocolExecutor(newSpeed)

  RENDER.renderNotComplete()
}

export default keyboardEvents
