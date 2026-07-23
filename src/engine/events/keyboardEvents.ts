/**
 *  @module keyboardEvents.ts Управляет нажатием клавиш на клавиатуре
 *     @function keyboardEvents Переводит нажатие клавиш в события игры
 */
import * as RENDER from '../render/isRender'
import { changeDirectionEvent } from './changeDirectionEvent'
import { checkPause } from './pauseEvent'
import * as TIMER from '../time/isTimer'
import speedEvent from './speedEvent'
import { checkMistake } from '../lives/isMistake'
import { getTimer } from '../time/timer'
import protocolExecutor from '../protocol/protocolExecutor'
import { howMuchIsLeftToEat } from '../food/currentFoodNumber'
import { getProtocol } from '../protocol/protocol'
import { getSnakeHeadParams } from '../snake/snake'
import noMoves from './noMovesEvent'
import type { SessionCommands } from '../session/sessionCommands'
import { productionSessionCommands } from '../session/productionSession'
import { handleLifecycleKeyboardEvent } from '../session/lifecycleInput'

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
export function processActiveKeyboardEvent(e: KeyboardEvent) {
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

  // findLastMoveDirection().name !== "" ? keyboardPauseEvent(e) : false;
  if (newDirection.name !== '') TIMER.startTimer()
  if ((newDirection.name === '' && newSpeed.name === '') || howMuchIsLeftToEat() === 0)
    return
  if ((TIMER.checkTimerWorking() || !checkMistake() || getTimer() === 0) && !checkPause())
    newDirection.name !== '' ? protocolExecutor(newDirection) : protocolExecutor(newSpeed)

  RENDER.renderNotComplete()
}

export function keyboardEventsForSession(
  e: KeyboardEvent,
  session: SessionCommands = productionSessionCommands,
): boolean {
  return handleLifecycleKeyboardEvent(e, session, processActiveKeyboardEvent)
}

function keyboardEvents(e: KeyboardEvent): boolean {
  return keyboardEventsForSession(e)
}

export default keyboardEvents
