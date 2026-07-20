import {
  registerSessionTimeout,
  type SessionEffectHandle,
} from '../engine/session/sessionEffects'
import type { LifecycleState } from '../engine/session/lifecycleController'

export const SCENE_FINISH_DELAY_MS = 500

export type GameFinishTimeoutRef = {
  current: SessionEffectHandle | null
}

export function clearGameFinishTimeout(ref: GameFinishTimeoutRef): void {
  ref.current?.cleanup()
  ref.current = null
}

export function scheduleGameFinishTimeout(
  ref: GameFinishTimeoutRef,
  onFinish: () => void
): void {
  if (ref.current !== null) return

  ref.current = registerSessionTimeout(() => {
    ref.current = null
    onFinish()
  }, SCENE_FINISH_DELAY_MS)
}

export function clearGameFinishTimeoutOnLifecycleReset(
  ref: GameFinishTimeoutRef,
  lifecycleState: LifecycleState,
): void {
  if (lifecycleState === 'active-gameplay' || lifecycleState === 'level-complete') {
    return
  }

  clearGameFinishTimeout(ref)
}
