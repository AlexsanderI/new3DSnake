import keyboardEvents from '../events/keyboardEvents'
import type { LifecycleState } from './lifecycleController'
import { lifecyclePauseKeyboardEvent } from './lifecycleInput'

export interface KeyboardListenerTarget {
  addEventListener: (
    type: 'keydown',
    listener: (event: KeyboardEvent) => void,
  ) => void
  removeEventListener: (
    type: 'keydown',
    listener: (event: KeyboardEvent) => void,
  ) => void
}

function getLifecycleKeyboardHandler(
  state: LifecycleState,
): ((event: KeyboardEvent) => void) | null {
  if (state === 'active-gameplay') return keyboardEvents
  if (state === 'paused') return lifecyclePauseKeyboardEvent

  return null
}

export function registerLifecycleKeyboardListeners(
  target: KeyboardListenerTarget,
  state: LifecycleState,
): () => void {
  const handler = getLifecycleKeyboardHandler(state)

  if (handler === null) {
    return () => {}
  }

  target.addEventListener('keydown', handler)

  let isCleanedUp = false
  return () => {
    if (isCleanedUp) return

    target.removeEventListener('keydown', handler)
    isCleanedUp = true
  }
}
