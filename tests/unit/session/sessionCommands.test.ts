import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createGameOverSnapshot,
  createVictorySnapshot,
} from '../../../src/engine/session/resultSnapshots'
import { createSessionCommands } from '../../../src/engine/session/sessionCommands'
import {
  beginSessionGeneration,
  cleanupSessionEffects,
  getSessionEffectCount,
  getSessionGeneration,
  registerSessionTimeout,
} from '../../../src/engine/session/sessionEffects'
import { BEST_SCORE_STORAGE_KEY } from '../../../src/engine/session/bestScore'
import { getCurrentLevel, setCurrentLevel } from '../../../src/engine/levels/currentLevel'
import { getLives, setLivesCount } from '../../../src/engine/lives/lives'
import { getScores, setScoresTotal } from '../../../src/engine/scores/scores'
import { getTimer, setTimerElapsed } from '../../../src/engine/time/timer'
import { checkTimerWorking, startTimer } from '../../../src/engine/time/isTimer'
import { checkPause, setPause } from '../../../src/engine/events/pauseEvent'
import { checkMistake, mistakeWasMade } from '../../../src/engine/lives/isMistake'
import {
  getProtocol,
  setProtocol,
} from '../../../src/engine/protocol/protocol'
import {
  getNewMoveDirection,
  setNewMoveDirection,
} from '../../../src/engine/events/changeDirectionEvent'
import {
  getCurrentDirection,
  setCurrentDirection,
} from '../../../src/engine/events/speedEvent'
import {
  getNewSwipeMove,
  setNewSwipeMove,
} from '../../../src/engine/events/swipeDirectionEvent'
import {
  addSnakeBodyCoord,
  getSnakeBodyCoord,
  getSnakeHeadParams,
  setSnakeHeadParams,
  setStoppedSnakeDirection,
} from '../../../src/engine/snake/snake'
import {
  getAmountOfFood,
  setAmountOfFood,
} from '../../../src/engine/food/amountOfFoodPerLevel'
import {
  getCurrentFoodNumber,
  setCurrentFoodNumberExact,
} from '../../../src/engine/food/currentFoodNumber'
import {
  getFoodCoord,
  getFoodScores,
  setFoodCoord,
  setFoodScores,
} from '../../../src/engine/food/food'
import {
  getBonusAvailability,
  giveBonus,
} from '../../../src/engine/bonuses/bonusAvailableState'
import {
  getStopsGrowing,
  setStopsGrowing,
} from '../../../src/engine/bonuses/bonusSnakeStopsGrowing'
import {
  getObstaclesStepX,
  getObstaclesXCoord,
  setObstaclesStepX,
  setObstaclesXCoord,
} from '../../../src/engine/obstacles/obstaclesX'
import {
  getObstacleSpeed,
  obstacleSpeedCounter,
} from '../../../src/engine/obstacles/obstacleSpeed'
import {
  getPreviousObstacleStepsX,
  setObstacleMovementHistory,
} from '../../../src/engine/obstacles/moveObstacles'
import {
  getObstacleVisualStateSnapshot,
  setObstacleVisualState,
} from '../../../src/components/obstacleVisualState'
import { Vector3 } from 'three'
import {
  getSnakePreviousStepsArray,
  setSnakePreviousStepsArray,
} from '../../../src/animations/snakeAnimation/snakeAnimation'
import {
  getCounterUnits,
  setCounterUnitsExact,
} from '../../../src/animations/snakeAnimation/bodyAnimations/snakeBodyMoving'
import { renderComplete, checkRenderCompleting } from '../../../src/engine/render/isRender'

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

function dirtySessionState() {
  setCurrentLevel(3)
  setScoresTotal(12)
  setLivesCount(2)
  setTimerElapsed(123)
  startTimer()
  setPause(true)
  mistakeWasMade()
  setProtocol([{ time: 1, name: 'X', value: 1 }])
  setNewMoveDirection('left')
  setCurrentDirection('left')
  setNewSwipeMove('left')
  setSnakeHeadParams({
    snakeHeadCoordX: 2,
    snakeHeadCoordY: 2,
    snakeHeadStepX: 1,
    snakeHeadStepY: 0,
  })
  addSnakeBodyCoord([1, 1])
  setStoppedSnakeDirection([1, 0])
  setAmountOfFood(2)
  setCurrentFoodNumberExact(2)
  setFoodCoord([1, 1])
  setFoodScores(5)
  giveBonus()
  setStopsGrowing(true)
  setObstaclesXCoord([[1, 1]])
  setObstaclesStepX([1])
  obstacleSpeedCounter()
  setObstacleMovementHistory({
    previousX: [1],
    previousY: [],
    stationaryX: [[1, 1]],
    stationaryY: [],
  })
  setObstacleVisualState({
    threeCoordX: [new Vector3(1, 1, 0)],
    threeCoordY: [],
    counter: 0.5,
    prevVisualX: [1],
    prevVisualY: [],
    nextEngineX: [2],
    nextEngineY: [],
  })
  setSnakePreviousStepsArray([{ previousStepX: 1, previousStepY: 0 }])
  setCounterUnitsExact([[0.5, 0]])
  renderComplete()
}

function expectCleanLevelOneState() {
  expect(getCurrentLevel()).toBe(1)
  expect(getScores()).toBe(0)
  expect(getLives()).toBe(10)
  expect(getTimer()).toBe(0)
  expect(checkTimerWorking()).toBe(false)
  expect(checkPause()).toBe(false)
  expect(checkMistake()).toBe(false)
  expect(getNewMoveDirection()).toBe('')
  expect(getCurrentDirection()).toBe('')
  expect(getNewSwipeMove()).toBe('')
  expect(getProtocol()).toHaveLength(3)
  expect(getProtocol()[0]).toEqual({ time: 0, name: 'start level', value: 1 })
  expect(getProtocol()[1]).toEqual({
    time: 0,
    name: 'set snake to start',
    value: '11:11',
  })
  expect(getProtocol()[2].time).toBe(0)
  expect(getProtocol()[2].name).toBe('set food')
  expect(getProtocol()[2].value).toMatch(/^\d+:\d+$/)
  expect(getSnakeHeadParams()).toEqual({
    snakeHeadCoordX: 11,
    snakeHeadCoordY: 11,
    snakeHeadStepX: 0,
    snakeHeadStepY: 0,
  })
  expect(getSnakeBodyCoord()).toEqual([
    [11, 11],
    [11, 10],
    [11, 9],
  ])
  expect(getAmountOfFood()).toBe(90)
  expect(getCurrentFoodNumber()).toBe(0)
  expect(getFoodCoord()).toHaveLength(2)
  expect(getFoodScores()).toBe(1)
  expect(getBonusAvailability()).toBe(false)
  expect(getStopsGrowing()).toBe(false)
  expect(getObstaclesXCoord()).toEqual([])
  expect(getObstaclesStepX()).toEqual([])
  expect(getObstacleSpeed()).toBe(0)
  expect(getPreviousObstacleStepsX()).toEqual([])
  expect(getObstacleVisualStateSnapshot()).toEqual({
    threeCoordX: [],
    threeCoordY: [],
    counter: -1,
    prevVisualX: [],
    prevVisualY: [],
    nextEngineX: [],
    nextEngineY: [],
  })
  expect(getSnakePreviousStepsArray()).toHaveLength(91)
  expect(getCounterUnits()).toHaveLength(91)
  expect(checkRenderCompleting()).toBe(false)
  expect(getSessionEffectCount()).toBe(0)
}

describe('session reset orchestration and commands', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    cleanupSessionEffects()
    beginSessionGeneration()
  })

  afterEach(() => {
    cleanupSessionEffects()
    vi.useRealTimers()
  })

  it('starts a session only from main-menu and initializes clean level 1 before active gameplay', () => {
    const session = createSessionCommands({ bestScoreStorage: createMemoryStorage(99) })
    dirtySessionState()

    expect(session.startSession()).toBe(true)

    expect(session.getState()).toBe('active-gameplay')
    expectCleanLevelOneState()
    expect(getLives()).toBeGreaterThan(0)

    dirtySessionState()
    expect(session.startSession()).toBe(false)
    expect(session.getState()).toBe('active-gameplay')
    expect(getCurrentLevel()).toBe(3)
  })

  it('preserves terminal snapshot until Play Again or Main Menu clears it', () => {
    const session = createSessionCommands({ bestScoreStorage: createMemoryStorage(20) })
    const gameOverSnapshot = createGameOverSnapshot(
      { score: 25, levelReached: 2, failureReason: 'no moves' },
      createMemoryStorage(20)
    )

    session.startSession()
    expect(session.setGameOverSnapshot(gameOverSnapshot)).toBe(true)
    expect(session.getTerminalSnapshot()).toBe(gameOverSnapshot)

    expect(session.pause()).toBe(false)
    expect(session.startSession()).toBe(false)
    expect(session.getTerminalSnapshot()).toBe(gameOverSnapshot)

    expect(session.playAgain()).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(session.getTerminalSnapshot()).toBeNull()
    expectCleanLevelOneState()
  })

  it('plays again from victory and returns to main menu without gameplay initialization', () => {
    const session = createSessionCommands({ bestScoreStorage: createMemoryStorage(33) })
    const victorySnapshot = createVictorySnapshot(
      { score: 40, levelsCompleted: 4 },
      createMemoryStorage(33)
    )

    session.startSession()
    expect(session.setVictorySnapshot(victorySnapshot)).toBe(true)
    dirtySessionState()

    expect(session.playAgain()).toBe(true)
    expect(session.getState()).toBe('active-gameplay')
    expect(session.getTerminalSnapshot()).toBeNull()
    expectCleanLevelOneState()

    expect(session.setVictorySnapshot(victorySnapshot)).toBe(true)
    dirtySessionState()
    expect(session.returnToMainMenu()).toBe(true)

    expect(session.getState()).toBe('main-menu')
    expect(session.getTerminalSnapshot()).toBeNull()
    expect(getCurrentLevel()).toBe(1)
    expect(getLives()).toBe(0)
    expect(getProtocol()).toEqual([])
  })

  it('preserves best score, increments generation, and removes old effects before initialization', () => {
    const storage = createMemoryStorage(77)
    const session = createSessionCommands({ bestScoreStorage: storage })
    let staleEffectCalls = 0
    const firstGeneration = getSessionGeneration()

    registerSessionTimeout(() => {
      staleEffectCalls += 1
    }, 100)

    expect(session.startSession()).toBe(true)

    vi.advanceTimersByTime(100)
    expect(staleEffectCalls).toBe(0)
    expect(getSessionGeneration()).toBe(firstGeneration + 1)
    expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('77')
    expectCleanLevelOneState()
  })

  it('runs 10 clean terminal to Play Again cycles and keeps reset idempotent', () => {
    const storage = createMemoryStorage(123)
    const session = createSessionCommands({ bestScoreStorage: storage })

    expect(session.startSession()).toBe(true)

    for (let cycle = 0; cycle < 10; cycle += 1) {
      dirtySessionState()
      const snapshot = createGameOverSnapshot(
        { score: cycle, levelReached: 3, failureReason: 'time limit' },
        storage
      )
      expect(session.setGameOverSnapshot(snapshot)).toBe(true)
      expect(session.getState()).toBe('game-over')

      expect(session.playAgain()).toBe(true)
      expect(session.getState()).toBe('active-gameplay')
      expectCleanLevelOneState()
      expect(storage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('123')

      session.resetSession()
      session.resetSession()
      expect(getScores()).toBe(0)
      expect(getLives()).toBe(0)
      expect(getProtocol()).toEqual([])
    }
  })

  it('only allows Play Again and Main Menu from terminal states', () => {
    const session = createSessionCommands({ bestScoreStorage: createMemoryStorage() })

    expect(session.playAgain()).toBe(false)
    expect(session.returnToMainMenu()).toBe(false)

    session.startSession()
    expect(session.returnToMainMenu()).toBe(false)
    expect(session.setGameOverSnapshot(
      createGameOverSnapshot(
        { score: 0, levelReached: 1, failureReason: 'lives limit' },
        createMemoryStorage()
      )
    )).toBe(true)

    expect(session.returnToMainMenu()).toBe(true)
    expect(session.getState()).toBe('main-menu')
  })
})
