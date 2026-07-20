import { beforeEach, describe, expect, it, vi } from 'vitest'

import { keyboardEventsForSession } from '../../../src/engine/events/keyboardEvents'
import { setCurrentLevel } from '../../../src/engine/levels/currentLevel'
import { clearProtocol, getProtocol } from '../../../src/engine/protocol/protocol'
import { reportGameOver } from '../../../src/engine/session/gameOverReporter'
import { BEST_SCORE_STORAGE_KEY } from '../../../src/engine/session/bestScore'
import { createSessionCommands } from '../../../src/engine/session/sessionCommands'
import { getNewMoveDirection, resetNewMoveDirection } from '../../../src/engine/events/changeDirectionEvent'
import { checkPause, resetPause } from '../../../src/engine/events/pauseEvent'
import { resetSpeedEventState, getCurrentDirection } from '../../../src/engine/events/speedEvent'
import { setScoresTotal } from '../../../src/engine/scores/scores'
import { resetTimer, setTimerElapsed } from '../../../src/engine/time/timer'
import { resetTimerRunning, startTimer } from '../../../src/engine/time/isTimer'
import { cleanupSessionEffects } from '../../../src/engine/session/sessionEffects'
import { useMenuStore, usePauseStore } from '../../../src/store/menuStore'

function createMemoryStorage(initialBest = 0) {
  const values = new Map<string, string>()
  values.set(BEST_SCORE_STORAGE_KEY, String(initialBest))

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
  }
}

function key(code: string): KeyboardEvent {
  return { code } as KeyboardEvent
}

function resetRuntimeState(): void {
  clearProtocol()
  resetNewMoveDirection()
  resetSpeedEventState()
  resetTimer()
  resetTimerRunning()
  resetPause()
  setScoresTotal(0)
  setCurrentLevel(1)
  useMenuStore.setState({ isVisible: true, titleMenu: 'start' })
  usePauseStore.setState({ isPause: true })
}

describe('Game Over result flow', () => {
  beforeEach(() => {
    cleanupSessionEffects()
    resetRuntimeState()
  })

  it.each([
    ['no moves', 'no available moves'],
    ['time limit', 'time expired'],
    ['lives limit', 'no lives remaining'],
  ] as const)('reports %s as %s with score, best score, and level snapshot', (
    engineReason,
    playerReason,
  ) => {
    const storage = createMemoryStorage(25)
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setScoresTotal(40)
    setCurrentLevel(3)

    expect(reportGameOver(engineReason, { session, storage })).toBe(true)

    expect(session.getState()).toBe('game-over')
    expect(session.getTerminalSnapshot()).toEqual({
      kind: 'game-over',
      score: 40,
      bestScore: 40,
      levelReached: 3,
      failureReason: playerReason,
    })
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('40')
  })

  it('keeps snapshot data stable after underlying score and level change', () => {
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setScoresTotal(12)
    setCurrentLevel(2)

    expect(reportGameOver('time limit', { session, storage: createMemoryStorage(50) })).toBe(true)
    const snapshot = session.getTerminalSnapshot()

    setScoresTotal(999)
    setCurrentLevel(9)

    expect(session.getTerminalSnapshot()).toBe(snapshot)
    expect(session.getTerminalSnapshot()).toEqual({
      kind: 'game-over',
      score: 12,
      bestScore: 50,
      levelReached: 2,
      failureReason: 'time expired',
    })
  })

  it('rejects duplicate Game Over reports and keeps the first snapshot visible', () => {
    const storage = createMemoryStorage()
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setScoresTotal(10)
    setCurrentLevel(1)

    expect(reportGameOver('no moves', { session, storage })).toBe(true)
    const firstSnapshot = session.getTerminalSnapshot()

    setScoresTotal(99)
    setCurrentLevel(5)

    expect(reportGameOver('time limit', { session, storage })).toBe(false)
    expect(session.getState()).toBe('game-over')
    expect(session.getTerminalSnapshot()).toBe(firstSnapshot)
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('10')
  })

  it('does not let protocol persistence failure block terminal reporting', () => {
    const storage = createMemoryStorage()
    const protocolStorage = {
      setItem: vi.fn(() => {
        throw new Error('protocol storage failed')
      }),
    }
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setScoresTotal(7)

    expect(reportGameOver('lives limit', {
      session,
      storage,
      protocolStorage,
    })).toBe(true)

    expect(session.getState()).toBe('game-over')
    expect(session.getTerminalSnapshot()).toMatchObject({
      score: 7,
      failureReason: 'no lives remaining',
    })
    expect(protocolStorage.setItem).toHaveBeenCalledOnce()
  })

  it('keeps terminal input ignored and result visible until explicit command', () => {
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setScoresTotal(20)

    expect(reportGameOver('no moves', { session, storage: createMemoryStorage() })).toBe(true)
    const snapshot = session.getTerminalSnapshot()

    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(false)
    expect(keyboardEventsForSession(key('Space'), session)).toBe(false)
    expect(getNewMoveDirection()).toBe('')
    expect(getCurrentDirection()).toBe('')
    expect(checkPause()).toBe(false)
    expect(session.getState()).toBe('game-over')
    expect(session.getTerminalSnapshot()).toBe(snapshot)

    expect(session.playAgain()).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(session.getTerminalSnapshot()).toBeNull()
  })

  it('Play Again and Main Menu use existing session command paths without reload', () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })

    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    expect(reportGameOver('time limit', { session, storage: createMemoryStorage() })).toBe(true)

    expect(session.playAgain()).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(reload).not.toHaveBeenCalled()

    expect(reportGameOver('time limit', { session, storage: createMemoryStorage() })).toBe(true)
    expect(session.returnToMainMenu()).toBe(true)
    expect(session.getState()).toBe('main-menu')
    expect(getProtocol()).toEqual([])
    expect(reload).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })

  it('captures a lower score without overwriting stored best score', () => {
    const storage = createMemoryStorage(100)
    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)
    setScoresTotal(80)

    expect(reportGameOver('time limit', { session, storage })).toBe(true)

    expect(session.getTerminalSnapshot()).toMatchObject({
      score: 80,
      bestScore: 100,
    })
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('100')
  })

  it('starts from the no-moves keyboard path without calling location.reload', () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })

    const session = createSessionCommands()
    expect(session.startSession()).toBe(true)

    reportGameOver('no moves', { session, storage: createMemoryStorage() })

    expect(session.getState()).toBe('game-over')
    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(false)
    expect(reload).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
