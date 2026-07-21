import { beforeEach, describe, expect, it, vi } from 'vitest'

import { keyboardEventsForSession } from '../../../src/engine/events/keyboardEvents'
import { resetNewMoveDirection, getNewMoveDirection } from '../../../src/engine/events/changeDirectionEvent'
import { checkPause, resetPause, setPause } from '../../../src/engine/events/pauseEvent'
import { resetSpeedEventState, getCurrentDirection } from '../../../src/engine/events/speedEvent'
import { createGameOverSnapshot, createVictorySnapshot } from '../../../src/engine/session/resultSnapshots'
import { createResultActions } from '../../../src/components/resultActions'
import {
  focusPrimaryActionOnce,
  type FocusableElement,
} from '../../../src/components/useFocusPrimaryAction'
import { registerLifecycleKeyboardListeners } from '../../../src/engine/session/lifecycleKeyboardListeners'
import { createSessionCommands, type SessionCommands } from '../../../src/engine/session/sessionCommands'
import { cleanupSessionEffects } from '../../../src/engine/session/sessionEffects'
import { useMenuStore, usePauseStore } from '../../../src/store/menuStore'

function key(code: string): KeyboardEvent {
  return { code } as KeyboardEvent
}

function resetUiState(): void {
  useMenuStore.setState({ isVisible: true, titleMenu: 'start' })
  usePauseStore.setState({ isPause: true })
  resetPause()
  resetNewMoveDirection()
  resetSpeedEventState()
}

function createGameOverSession(): SessionCommands {
  const session = createSessionCommands()
  expect(session.startSession()).toBe(true)
  expect(session.setGameOverSnapshot(
    createGameOverSnapshot({
      score: 10,
      levelReached: 2,
      failureReason: 'no moves',
    }),
  )).toBe(true)
  return session
}

function createVictorySession(): SessionCommands {
  const session = createSessionCommands()
  expect(session.startSession()).toBe(true)
  expect(session.setVictorySnapshot(
    createVictorySnapshot({
      score: 20,
      levelsCompleted: 4,
    }),
  )).toBe(true)
  return session
}

describe('terminal result actions and accessibility helpers', () => {
  beforeEach(() => {
    cleanupSessionEffects()
    resetUiState()
  })

  it('runs Game Over Play Again once, closes result UI, and clears pause UI state', () => {
    const session = createGameOverSession()
    const playAgain = vi.spyOn(session, 'playAgain')
    useMenuStore.setState({ isVisible: true, titleMenu: 'Game Over' })
    usePauseStore.setState({ isPause: true })
    setPause(true)

    const actions = createResultActions({ session })

    expect(actions.onPlayAgain()).toBe(true)
    expect(actions.onPlayAgain()).toBe(false)

    expect(playAgain).toHaveBeenCalledOnce()
    expect(session.getState()).toBe('active-gameplay')
    expect(useMenuStore.getState().isVisible).toBe(false)
    expect(usePauseStore.getState().isPause).toBe(false)
    expect(checkPause()).toBe(false)
  })

  it('runs Victory Play Again once through the same shared action path', () => {
    const session = createVictorySession()
    const playAgain = vi.spyOn(session, 'playAgain')
    const actions = createResultActions({ session })

    expect(actions.onPlayAgain()).toBe(true)
    expect(actions.onPlayAgain()).toBe(false)

    expect(playAgain).toHaveBeenCalledOnce()
    expect(session.getState()).toBe('active-gameplay')
    expect(useMenuStore.getState().isVisible).toBe(false)
  })

  it('runs Game Over Main Menu once, opens exact start UI, and clears pause UI state', () => {
    const session = createGameOverSession()
    const returnToMainMenu = vi.spyOn(session, 'returnToMainMenu')
    usePauseStore.setState({ isPause: true })
    setPause(true)

    const actions = createResultActions({ session })

    expect(actions.onMainMenu()).toBe(true)
    expect(actions.onMainMenu()).toBe(false)

    expect(returnToMainMenu).toHaveBeenCalledOnce()
    expect(session.getState()).toBe('main-menu')
    expect(useMenuStore.getState()).toMatchObject({
      isVisible: true,
      titleMenu: 'start',
    })
    expect(usePauseStore.getState().isPause).toBe(false)
    expect(checkPause()).toBe(false)
  })

  it('runs Victory Main Menu once through the same shared action path', () => {
    const session = createVictorySession()
    const returnToMainMenu = vi.spyOn(session, 'returnToMainMenu')
    const actions = createResultActions({ session })

    expect(actions.onMainMenu()).toBe(true)
    expect(actions.onMainMenu()).toBe(false)

    expect(returnToMainMenu).toHaveBeenCalledOnce()
    expect(session.getState()).toBe('main-menu')
    expect(useMenuStore.getState().titleMenu).toBe('start')
  })

  it('does not partially mutate UI when lifecycle commands fail', () => {
    const session = createSessionCommands()
    const actions = createResultActions({ session })
    useMenuStore.setState({ isVisible: true, titleMenu: 'Game Over' })
    usePauseStore.setState({ isPause: true })
    setPause(true)

    expect(actions.onPlayAgain()).toBe(false)
    expect(actions.onMainMenu()).toBe(false)

    expect(useMenuStore.getState()).toMatchObject({
      isVisible: true,
      titleMenu: 'Game Over',
    })
    expect(usePauseStore.getState().isPause).toBe(true)
    expect(checkPause()).toBe(true)
  })

  it('focuses the primary result action once and does not steal focus on rerender', () => {
    const focus = vi.fn()
    const element: FocusableElement = { focus }
    const focusState = { didFocus: false }

    expect(focusPrimaryActionOnce(element, focusState)).toBe(true)
    expect(focusPrimaryActionOnce(element, focusState)).toBe(false)

    expect(focus).toHaveBeenCalledOnce()
  })

  it('does not focus when no primary action element is available', () => {
    const focusState = { didFocus: false }

    expect(focusPrimaryActionOnce(null, focusState)).toBe(false)
    expect(focusState.didFocus).toBe(false)
  })

  it('does not install gameplay or pause listeners for terminal lifecycle states', () => {
    const target = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    registerLifecycleKeyboardListeners(target, 'game-over')()
    registerLifecycleKeyboardListeners(target, 'victory')()

    expect(target.addEventListener).not.toHaveBeenCalled()
    expect(target.removeEventListener).not.toHaveBeenCalled()
  })

  it('keeps Space outside a focused result button as a terminal no-op', () => {
    const session = createVictorySession()

    expect(keyboardEventsForSession(key('Space'), session)).toBe(false)
    expect(session.getState()).toBe('victory')
    expect(getNewMoveDirection()).toBe('')
    expect(getCurrentDirection()).toBe('')
    expect(checkPause()).toBe(false)
  })
})
