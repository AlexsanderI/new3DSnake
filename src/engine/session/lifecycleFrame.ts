import * as INTERRUPT from '../events/interruptGameEvent'
import playLevel from '../levels/playLevel'
import { checkTimerWorking } from '../time/isTimer'
import { setTimer } from '../time/timer'
import type { LifecycleState } from './lifecycleController'
import { productionSessionCommands } from './productionSession'

export interface LifecycleFrameRuntime {
  getLifecycleState: () => LifecycleState
  interruptGameEvent: () => void
  getInterruptGame: () => boolean
  playLevel: () => void
  checkTimerWorking: () => boolean
  setTimer: (milliseconds: number) => void
}

const defaultRuntime: LifecycleFrameRuntime = {
  getLifecycleState: productionSessionCommands.getState,
  interruptGameEvent: INTERRUPT.interruptGameEvent,
  getInterruptGame: INTERRUPT.getInterruptGame,
  playLevel,
  checkTimerWorking,
  setTimer,
}

export function shouldAdvanceGameplay(state: LifecycleState): boolean {
  return state === 'active-gameplay'
}

export function shouldRenderFrame(): boolean {
  return true
}

export function runLifecycleFrame(
  delta: number,
  runtime: LifecycleFrameRuntime = defaultRuntime,
): boolean {
  if (!shouldAdvanceGameplay(runtime.getLifecycleState())) return false

  runtime.interruptGameEvent()
  if (!runtime.getInterruptGame()) {
    runtime.playLevel()
  }
  if (runtime.checkTimerWorking()) runtime.setTimer(delta * 1000)

  return true
}
