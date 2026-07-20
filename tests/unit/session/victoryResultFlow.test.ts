import { beforeEach, describe, expect, it, vi } from 'vitest'

import { keyboardEventsForSession } from '../../../src/engine/events/keyboardEvents'
import { setCurrentLevel } from '../../../src/engine/levels/currentLevel'
import { getMaxLevel, setMaxLevel } from '../../../src/engine/levels/maxLevel'
import levelComplete from '../../../src/engine/protocol/levelComplete'
import { clearProtocol, getProtocol } from '../../../src/engine/protocol/protocol'
import { BEST_SCORE_STORAGE_KEY } from '../../../src/engine/session/bestScore'
import { productionSessionCommands } from '../../../src/engine/session/productionSession'
import { reportVictory } from '../../../src/engine/session/victoryReporter'
import { createSessionCommands, type SessionCommands } from '../../../src/engine/session/sessionCommands'
import { getNewMoveDirection, resetNewMoveDirection } from '../../../src/engine/events/changeDirectionEvent'
import { checkPause, resetPause } from '../../../src/engine/events/pauseEvent'
import { getCurrentDirection, resetSpeedEventState } from '../../../src/engine/events/speedEvent'
import { setScoresTotal } from '../../../src/engine/scores/scores'
import { resetTimer, setTimerElapsed } from '../../../src/engine/time/timer'
import { resetTimerRunning } from '../../../src/engine/time/isTimer'
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
  setMaxLevel()
  useMenuStore.setState({ isVisible: true, titleMenu: 'start' })
  usePauseStore.setState({ isPause: true })
}

function createActiveSession(): SessionCommands {
  const session = createSessionCommands()
  expect(session.startSession()).toBe(true)
  return session
}

function ensureProductionActive(): void {
  const state = productionSessionCommands.getState()

  if (state === 'main-menu') {
    productionSessionCommands.startSession()
  } else if (state === 'game-over' || state === 'victory') {
    productionSessionCommands.playAgain()
  } else if (state === 'paused') {
    productionSessionCommands.resume()
  }
}

describe('Victory result flow', () => {
  beforeEach(() => {
    cleanupSessionEffects()
    resetRuntimeState()
  })

  it('does not enter victory when completing a non-final level', () => {
    ensureProductionActive()
    setCurrentLevel(1)

    levelComplete()

    expect(productionSessionCommands.getState()).not.toBe('victory')
  })

  it('reports final Victory with score, best score, and total levels completed', () => {
    const storage = createMemoryStorage(25)
    const session = createActiveSession()
    setScoresTotal(40)
    setCurrentLevel(getMaxLevel())

    expect(reportVictory({ session, storage })).toBe(true)

    expect(session.getState()).toBe('victory')
    expect(session.getTerminalSnapshot()).toEqual({
      kind: 'victory',
      score: 40,
      bestScore: 40,
      levelsCompleted: getMaxLevel(),
    })
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('40')
  })

  it('captures lower final score without overwriting stored best score', () => {
    const storage = createMemoryStorage(100)
    const session = createActiveSession()
    setScoresTotal(80)

    expect(reportVictory({ session, storage })).toBe(true)

    expect(session.getTerminalSnapshot()).toMatchObject({
      score: 80,
      bestScore: 100,
      levelsCompleted: getMaxLevel(),
    })
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('100')
  })

  it('keeps Victory snapshot stable after live score and level changes', () => {
    const session = createActiveSession()
    setScoresTotal(12)
    setCurrentLevel(2)

    expect(reportVictory({ session, storage: createMemoryStorage(50) })).toBe(true)
    const snapshot = session.getTerminalSnapshot()

    setScoresTotal(999)
    setCurrentLevel(9)

    expect(session.getTerminalSnapshot()).toBe(snapshot)
    expect(session.getTerminalSnapshot()).toEqual({
      kind: 'victory',
      score: 12,
      bestScore: 50,
      levelsCompleted: getMaxLevel(),
    })
  })

  it('rejects duplicate Victory reports before updating best score', () => {
    const storage = createMemoryStorage()
    const session = createActiveSession()
    setScoresTotal(10)

    expect(reportVictory({ session, storage })).toBe(true)
    const firstSnapshot = session.getTerminalSnapshot()

    setScoresTotal(99)

    expect(reportVictory({ session, storage })).toBe(false)
    expect(session.getState()).toBe('victory')
    expect(session.getTerminalSnapshot()).toBe(firstSnapshot)
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('10')
  })

  it('does not let protocol persistence failure block Victory reporting', () => {
    const protocolStorage = {
      setItem: vi.fn(() => {
        throw new Error('protocol storage failed')
      }),
    }
    const session = createActiveSession()
    setScoresTotal(7)

    expect(reportVictory({
      session,
      storage: createMemoryStorage(),
      protocolStorage,
    })).toBe(true)

    expect(session.getState()).toBe('victory')
    expect(session.getTerminalSnapshot()).toMatchObject({
      score: 7,
      levelsCompleted: getMaxLevel(),
    })
    expect(protocolStorage.setItem).toHaveBeenCalledOnce()
  })

  it('keeps terminal input ignored and Victory visible until explicit command', () => {
    const session = createActiveSession()
    setScoresTotal(20)

    expect(reportVictory({ session, storage: createMemoryStorage() })).toBe(true)
    const snapshot = session.getTerminalSnapshot()

    expect(keyboardEventsForSession(key('ArrowRight'), session)).toBe(false)
    expect(keyboardEventsForSession(key('Space'), session)).toBe(false)
    expect(getNewMoveDirection()).toBe('')
    expect(getCurrentDirection()).toBe('')
    expect(checkPause()).toBe(false)
    expect(session.getState()).toBe('victory')
    expect(session.getTerminalSnapshot()).toBe(snapshot)

    expect(session.playAgain()).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(session.getTerminalSnapshot()).toBeNull()
  })

  it('final level completion does not call location.reload', () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })
    ensureProductionActive()
    setCurrentLevel(getMaxLevel())
    setScoresTotal(31)

    levelComplete()

    expect(productionSessionCommands.getState()).toBe('victory')
    expect(productionSessionCommands.getTerminalSnapshot()).toMatchObject({
      kind: 'victory',
      score: 31,
      levelsCompleted: getMaxLevel(),
    })
    expect(reload).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })

  it('Play Again and Main Menu use existing session command paths without reload', () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })
    const session = createActiveSession()
    setScoresTotal(44)

    expect(reportVictory({ session, storage: createMemoryStorage() })).toBe(true)
    expect(session.playAgain()).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(reload).not.toHaveBeenCalled()

    expect(reportVictory({ session, storage: createMemoryStorage() })).toBe(true)
    expect(session.returnToMainMenu()).toBe(true)
    expect(session.getState()).toBe('main-menu')
    expect(getProtocol()).toEqual([])
    expect(reload).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
