import { useMenuStore, usePauseStore } from '../../store/menuStore'
import { setPause } from '../events/pauseEvent'
import { stopTimer } from '../time/isTimer'
import type { SessionCommands } from './sessionCommands'
import { productionSessionCommands } from './productionSession'

type ActiveInputHandler = (event: KeyboardEvent) => void

export function canHandleGameplayInput(session: SessionCommands): boolean {
  return session.getState() === 'active-gameplay'
}

export function syncPauseState(isPaused: boolean): void {
  setPause(isPaused)

  const menuStore = useMenuStore.getState()
  const pauseStore = usePauseStore.getState()

  menuStore.setModalVisible(isPaused)
  if (isPaused) {
    menuStore.selectTitleMenu('Pause')
  }
  pauseStore.setPauseVisible(isPaused)
}

export function pauseWithLifecycle(
  session: SessionCommands = productionSessionCommands,
): boolean {
  if (!session.pause()) return false

  syncPauseState(true)
  stopTimer()
  return true
}

export function resumeWithLifecycle(
  session: SessionCommands = productionSessionCommands,
): boolean {
  if (!session.resume()) return false

  syncPauseState(false)
  return true
}

export function handleLifecycleKeyboardEvent(
  event: KeyboardEvent,
  session: SessionCommands,
  handleActiveInput: ActiveInputHandler,
): boolean {
  if (event.code === 'Space') {
    return session.getState() === 'paused'
      ? resumeWithLifecycle(session)
      : pauseWithLifecycle(session)
  }

  if (!canHandleGameplayInput(session)) return false

  handleActiveInput(event)
  return true
}

export function lifecyclePauseKeyboardEvent(event: KeyboardEvent): boolean {
  if (event.code !== 'Space') return productionSessionCommands.getState() === 'paused'

  return resumeWithLifecycle(productionSessionCommands)
}
