import { setPause } from '../engine/events/pauseEvent'
import { productionSessionCommands } from '../engine/session/productionSession'
import type { SessionCommands } from '../engine/session/sessionCommands'
import { useMenuStore, usePauseStore } from '../store/menuStore'

export interface TerminalResultActions {
  onPlayAgain: () => boolean
  onMainMenu: () => boolean
}

export interface ResultActionOptions {
  session?: SessionCommands
}

function clearPauseState(): void {
  setPause(false)
  usePauseStore.getState().setPauseVisible(false)
}

export function createResultActions(
  options: ResultActionOptions = {},
): TerminalResultActions {
  const session = options.session ?? productionSessionCommands
  let hasExecutedAction = false

  const runOnce = (command: () => boolean, onSuccess: () => void): boolean => {
    if (hasExecutedAction) return false
    if (!command()) return false

    hasExecutedAction = true
    onSuccess()
    return true
  }

  return {
    onPlayAgain: () =>
      runOnce(session.playAgain, () => {
        clearPauseState()
        useMenuStore.getState().setModalVisible(false)
      }),
    onMainMenu: () =>
      runOnce(session.returnToMainMenu, () => {
        clearPauseState()
        const menuStore = useMenuStore.getState()
        menuStore.selectTitleMenu('start')
        menuStore.setModalVisible(true)
      }),
  }
}
