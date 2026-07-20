import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clearGameFinishTimeoutOnLifecycleReset } from '../../../src/components/gameFinishTimeout'
import { resetNewMoveDirection, getNewMoveDirection } from '../../../src/engine/events/changeDirectionEvent'
import { checkPause, resetPause } from '../../../src/engine/events/pauseEvent'
import { resetSpeedEventState, getCurrentDirection } from '../../../src/engine/events/speedEvent'
import { resetSwipeDirection } from '../../../src/engine/events/swipeDirectionEvent'
import { resetMistake } from '../../../src/engine/lives/isMistake'
import { setLivesCount } from '../../../src/engine/lives/lives'
import { clearProtocol, getProtocol, setProtocol } from '../../../src/engine/protocol/protocol'
import { keyboardEventsForSession } from '../../../src/engine/events/keyboardEvents'
import { productionSessionCommands } from '../../../src/engine/session/productionSession'
import {
  createSessionCommands,
  type SessionCommands,
} from '../../../src/engine/session/sessionCommands'
import {
  pauseWithLifecycle,
  resumeWithLifecycle,
} from '../../../src/engine/session/lifecycleInput'
import {
  registerLifecycleKeyboardListeners,
  type KeyboardListenerTarget,
} from '../../../src/engine/session/lifecycleKeyboardListeners'
import {
  runLifecycleFrame,
  shouldRenderFrame,
} from '../../../src/engine/session/lifecycleFrame'
import {
  cleanupSessionEffects,
  getSessionEffectCount,
} from '../../../src/engine/session/sessionEffects'
import { resetTimer, setTimerElapsed } from '../../../src/engine/time/timer'
import { resetTimerRunning, startTimer } from '../../../src/engine/time/isTimer'
import { useMenuStore, usePauseStore } from '../../../src/store/menuStore'

function key(code: string): KeyboardEvent {
  return { code } as KeyboardEvent
}

class FakeKeyboardTarget implements KeyboardListenerTarget {
  readonly listeners = new Set<(event: KeyboardEvent) => void>()
  addCalls = 0
  removeCalls = 0

  addEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void {
    expect(type).toBe('keydown')
    this.addCalls += 1
    this.listeners.add(listener)
  }

  removeEventListener(type: 'keydown', listener: (event: KeyboardEvent) => void): void {
    expect(type).toBe('keydown')
    this.removeCalls += 1
    this.listeners.delete(listener)
  }
}

function resetInputState(): void {
  clearProtocol()
  resetNewMoveDirection()
  resetSpeedEventState()
  resetSwipeDirection()
  resetMistake()
  resetTimer()
  resetTimerRunning()
  resetPause()
  useMenuStore.setState({ isVisible: true, titleMenu: 'start' })
  usePauseStore.setState({ isPause: true })
}

describe('React/R3F lifecycle integration seams', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    cleanupSessionEffects()
    resetInputState()
  })

  afterEach(() => {
    cleanupSessionEffects()
    vi.useRealTimers()
  })

  it('exposes one production session command instance', () => {
    expect(productionSessionCommands).toBe(productionSessionCommands)
    expect(productionSessionCommands.getState()).toBe('main-menu')
  })

  it('advances gameplay frames only during active gameplay while rendering remains allowed', () => {
    const calls: string[] = []
    const frameRuntime = {
      getLifecycleState: () => 'main-menu' as const,
      interruptGameEvent: () => calls.push('interrupt'),
      getInterruptGame: () => false,
      playLevel: () => calls.push('play'),
      checkTimerWorking: () => true,
      setTimer: (milliseconds: number) => calls.push(`timer:${milliseconds}`),
    }

    expect(runLifecycleFrame(0.5, frameRuntime)).toBe(false)
    expect(calls).toEqual([])
    expect(shouldRenderFrame()).toBe(true)

    frameRuntime.getLifecycleState = () => 'active-gameplay'

    expect(runLifecycleFrame(0.5, frameRuntime)).toBe(true)
    expect(calls).toEqual(['interrupt', 'play', 'timer:500'])
  })

  it('gates movement and speed input outside active gameplay before engine mutation', () => {
    const session = createSessionCommands()

    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(false)
    expect(getNewMoveDirection()).toBe('')
    expect(getProtocol()).toEqual([])

    expect(session.startSession()).toBe(true)
    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(true)
    expect(getNewMoveDirection()).toBe('right')

    resetNewMoveDirection()
    setProtocol([
      { time: 0, name: 'start level', value: 1 },
      { time: 0, name: 'X', value: 1 },
    ])
    startTimer()
    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(true)
    expect(getCurrentDirection()).toBe(1)

    expect(session.setGameOverSnapshot(
      Object.freeze({
        kind: 'game-over',
        score: 0,
        bestScore: 0,
        levelReached: 1,
        failureReason: 'no available moves',
      }),
    )).toBe(true)

    resetNewMoveDirection()
    resetSpeedEventState()
    expect(keyboardEventsForSession(key('ArrowLeft'), session)).toBe(false)
    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(false)
    expect(getNewMoveDirection()).toBe('')
    expect(getCurrentDirection()).toBe('')

    const victorySession = createSessionCommands()
    expect(victorySession.startSession()).toBe(true)
    expect(victorySession.setVictorySnapshot(
      Object.freeze({
        kind: 'victory',
        score: 1,
        bestScore: 1,
        levelsCompleted: 1,
      }),
    )).toBe(true)
    expect(keyboardEventsForSession(key('ArrowRight'), victorySession)).toBe(false)
  })

  it('allows pause only from active gameplay and resume only from paused while syncing UI and engine state', () => {
    const session = createSessionCommands()

    expect(pauseWithLifecycle(session)).toBe(false)
    expect(checkPause()).toBe(false)
    expect(useMenuStore.getState().isVisible).toBe(true)

    expect(session.startSession()).toBe(true)
    useMenuStore.setState({ isVisible: false, titleMenu: 'start' })
    usePauseStore.setState({ isPause: false })

    expect(pauseWithLifecycle(session)).toBe(true)
    expect(session.getState()).toBe('paused')
    expect(checkPause()).toBe(true)
    expect(useMenuStore.getState()).toMatchObject({
      isVisible: true,
      titleMenu: 'Pause',
    })
    expect(usePauseStore.getState().isPause).toBe(true)

    expect(pauseWithLifecycle(session)).toBe(false)
    expect(session.getState()).toBe('paused')

    expect(resumeWithLifecycle(session)).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(checkPause()).toBe(false)
    expect(useMenuStore.getState().isVisible).toBe(false)
    expect(usePauseStore.getState().isPause).toBe(false)

    expect(resumeWithLifecycle(session)).toBe(false)
    expect(session.setGameOverSnapshot(
      Object.freeze({
        kind: 'game-over',
        score: 0,
        bestScore: 0,
        levelReached: 1,
        failureReason: 'time expired',
      }),
    )).toBe(true)
    expect(pauseWithLifecycle(session)).toBe(false)
    expect(keyboardEventsForSession(key('Space'), session)).toBe(false)
  })

  it('registers lifecycle-derived listeners without duplicates across StrictMode, pause, resume, and restart', () => {
    const target = new FakeKeyboardTarget()
    const session = createSessionCommands()

    let cleanup = registerLifecycleKeyboardListeners(target, session.getState())
    expect(target.listeners.size).toBe(0)

    cleanup()
    cleanup = registerLifecycleKeyboardListeners(target, session.getState())
    expect(target.listeners.size).toBe(0)

    expect(session.startSession()).toBe(true)
    cleanup()
    cleanup = registerLifecycleKeyboardListeners(target, session.getState())
    expect(target.listeners.size).toBe(1)

    for (let index = 0; index < 3; index += 1) {
      expect(pauseWithLifecycle(session)).toBe(true)
      cleanup()
      cleanup = registerLifecycleKeyboardListeners(target, session.getState())
      expect(target.listeners.size).toBe(1)

      expect(resumeWithLifecycle(session)).toBe(true)
      cleanup()
      cleanup = registerLifecycleKeyboardListeners(target, session.getState())
      expect(target.listeners.size).toBe(1)
    }

    expect(session.setGameOverSnapshot(
      Object.freeze({
        kind: 'game-over',
        score: 0,
        bestScore: 0,
        levelReached: 1,
        failureReason: 'no lives remaining',
      }),
    )).toBe(true)
    cleanup()
    cleanup = registerLifecycleKeyboardListeners(target, session.getState())
    expect(target.listeners.size).toBe(0)

    expect(session.playAgain()).toBe(true)
    cleanup()
    cleanup = registerLifecycleKeyboardListeners(target, session.getState())
    expect(target.listeners.size).toBe(1)

    cleanup()
    expect(target.listeners.size).toBe(0)
    expect(target.addCalls).toBe(target.removeCalls)
  })

  it('clears Game finish timeout on lifecycle reset or unmount', () => {
    const finish = vi.fn()
    const ref = { current: null }
    const handle = setTimeout(finish, 500)
    ref.current = {
      cleanup: () => {
        clearTimeout(handle)
        ref.current = null
      },
    }

    clearGameFinishTimeoutOnLifecycleReset(ref, 'starting-session')
    vi.advanceTimersByTime(500)

    expect(finish).not.toHaveBeenCalled()
    expect(ref.current).toBeNull()
    expect(getSessionEffectCount()).toBe(0)
  })

  it('keeps pause no-op from terminal states even when lives are exhausted', () => {
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setLivesCount(0)
    expect(session.setGameOverSnapshot(
      Object.freeze({
        kind: 'game-over',
        score: 0,
        bestScore: 0,
        levelReached: 1,
        failureReason: 'no lives remaining',
      }),
    )).toBe(true)

    expect(keyboardEventsForSession(key('Space'), session)).toBe(false)
    expect(checkPause()).toBe(false)
  })
})
