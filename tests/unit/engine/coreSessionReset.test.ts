import { beforeEach, describe, expect, it } from 'vitest'
import { getCurrentLevel, resetCurrentLevel, setCurrentLevel } from '../../../src/engine/levels/currentLevel'
import { getAmountOfLives, setAmountOfLives } from '../../../src/engine/lives/amountOfLivesPerLevel'
import {
  consumeLife,
  getLives,
  hasNoLivesRemaining,
  resetLives,
  setLives,
  setLivesCount,
} from '../../../src/engine/lives/lives'
import {
  checkMistake,
  mistakeWasMade,
  resetMistake,
} from '../../../src/engine/lives/isMistake'
import {
  addEvent,
  clearProtocol,
  getProtocol,
} from '../../../src/engine/protocol/protocol'
import { getScores, resetScores, setScores } from '../../../src/engine/scores/scores'
import {
  checkTimerWorking,
  resetTimerRunning,
  startTimer,
} from '../../../src/engine/time/isTimer'
import {
  getTimer,
  resetTimer,
  setTimer,
  setTimerElapsed,
} from '../../../src/engine/time/timer'
import {
  checkPause,
  resetPause,
  setPause,
  swapPause,
} from '../../../src/engine/events/pauseEvent'
import {
  getNewMoveDirection,
  resetNewMoveDirection,
  setNewMoveDirection,
} from '../../../src/engine/events/changeDirectionEvent'
import {
  getCurrentDirection,
  resetSpeedEventState,
  setCurrentDirection,
} from '../../../src/engine/events/speedEvent'
import {
  getNewSwipeMove,
  resetSwipeDirection,
  setNewSwipeMove,
} from '../../../src/engine/events/swipeDirectionEvent'

describe('core session reset APIs', () => {
  beforeEach(() => {
    resetScores()
    clearProtocol()
    resetCurrentLevel()
    resetLives()
    resetTimer()
    resetTimerRunning()
    resetPause()
    resetMistake()
    resetNewMoveDirection()
    resetSpeedEventState()
    resetSwipeDirection()
  })

  it('resets score exactly and idempotently', () => {
    setScores(25)

    resetScores()
    resetScores()

    expect(getScores()).toBe(0)
  })

  it('clears protocol exactly and idempotently', () => {
    addEvent({ name: 'game over', value: 'no moves' })

    clearProtocol()
    clearProtocol()

    expect(getProtocol()).toEqual([])
  })

  it('resets current level to level 1 exactly and idempotently', () => {
    setCurrentLevel(4)

    resetCurrentLevel()
    resetCurrentLevel()

    expect(getCurrentLevel()).toBe(1)
  })

  it('resets timer elapsed and running state exactly and idempotently', () => {
    setTimer(12)
    startTimer()

    resetTimer()
    resetTimerRunning()
    resetTimer()
    resetTimerRunning()

    expect(getTimer()).toBe(0)
    expect(checkTimerWorking()).toBe(false)
  })

  it('sets timer elapsed exactly without additive reset tricks', () => {
    setTimer(10)
    setTimerElapsed(3)

    expect(getTimer()).toBe(3)
  })

  it('resets pause to false without toggling and remains idempotent', () => {
    swapPause()

    resetPause()
    resetPause()

    expect(checkPause()).toBe(false)
  })

  it('sets pause exactly', () => {
    setPause(true)
    expect(checkPause()).toBe(true)

    setPause(false)
    expect(checkPause()).toBe(false)
  })

  it('resets mistake state exactly and idempotently', () => {
    mistakeWasMade()

    resetMistake()
    resetMistake()

    expect(checkMistake()).toBe(false)
  })

  it('sets and resets lives exactly without changing configured life counts', () => {
    setAmountOfLives(3)
    setLivesCount(8)
    setLives(-2)

    resetLives()
    resetLives()

    expect(getLives()).toBe(0)
    expect(getAmountOfLives()).toBe(3)
  })

  it('consumes lives without producing negative values', () => {
    setLivesCount(1)

    expect(consumeLife()).toBe(0)
    expect(consumeLife()).toBe(0)

    expect(getLives()).toBe(0)
  })

  it('detects zero remaining lives as terminal no-lives state', () => {
    setLivesCount(1)

    consumeLife()

    expect(getLives()).toBe(0)
    expect(hasNoLivesRemaining()).toBe(true)
  })

  it('resets input-related event state exactly and idempotently', () => {
    setNewMoveDirection('left')
    setCurrentDirection(1)
    setNewSwipeMove('right')

    resetNewMoveDirection()
    resetSpeedEventState()
    resetSwipeDirection()
    resetNewMoveDirection()
    resetSpeedEventState()
    resetSwipeDirection()

    expect(getNewMoveDirection()).toBe('')
    expect(getCurrentDirection()).toBe('')
    expect(getNewSwipeMove()).toBe('')
  })
})
