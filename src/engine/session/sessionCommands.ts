import { resetSnakeAnimations } from '../../animations/snakeAnimation/resetSnakeAnimations'
import { resetObstacleVisualState } from '../../components/obstacleVisualState'
import setInitialLevelOfGame from '../events/setInitialLevelOfGame'
import { resetNewMoveDirection } from '../events/changeDirectionEvent'
import { setNewGame } from '../events/interruptGameEvent'
import { resetPause } from '../events/pauseEvent'
import { resetSpeedEventState } from '../events/speedEvent'
import { resetSwipeDirection } from '../events/swipeDirectionEvent'
import { resetFood } from '../food/food'
import { resetCurrentLevel } from '../levels/currentLevel'
import { resetLives } from '../lives/lives'
import { resetMistake } from '../lives/isMistake'
import { resetBonuses } from '../bonuses/resetBonuses'
import { resetObstacles } from '../obstacles/resetObstacles'
import { clearProtocol } from '../protocol/protocol'
import { resetRender } from '../render/isRender'
import { resetRenderInfo } from '../render/renderInfo'
import { resetScores } from '../scores/scores'
import { resetSnake } from '../snake/snake'
import { resetTimerRunning } from '../time/isTimer'
import { resetTimer } from '../time/timer'
import {
  beginSessionGeneration,
  cleanupSessionEffects,
} from './sessionEffects'
import {
  createLifecycleController,
  type LifecycleController,
  type LifecycleState,
} from './lifecycleController'
import type {
  GameOverSnapshot,
  VictorySnapshot,
} from './resultSnapshots'
import type { BestScoreStorage } from './bestScore'

export type TerminalSnapshot =
  | Readonly<GameOverSnapshot>
  | Readonly<VictorySnapshot>

export interface SessionCommands {
  getState: () => LifecycleState
  subscribe: LifecycleController['subscribe']
  getTerminalSnapshot: () => TerminalSnapshot | null
  resetSession: () => void
  startSession: () => boolean
  playAgain: () => boolean
  returnToMainMenu: () => boolean
  setGameOverSnapshot: (snapshot: Readonly<GameOverSnapshot>) => boolean
  setVictorySnapshot: (snapshot: Readonly<VictorySnapshot>) => boolean
  pause: () => boolean
  resume: () => boolean
}

export interface SessionCommandsOptions {
  bestScoreStorage?: BestScoreStorage
}

function stopGameplayMutation(): void {
  resetTimerRunning()
  setNewGame()
}

function resetCoreSessionState(): void {
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
}

function resetWorldState(): void {
  resetSnake()
  resetFood()
  resetBonuses()
}

function resetVisualAndRenderState(): void {
  resetObstacles()
  resetObstacleVisualState()
  resetSnakeAnimations()
  resetRender()
  resetRenderInfo({})
}

function initializeLevelOne(): void {
  resetCurrentLevel()
  setInitialLevelOfGame(1)
}

export function createSessionCommands(
  _options: SessionCommandsOptions = {},
): SessionCommands {
  const lifecycle = createLifecycleController()
  let terminalSnapshot: TerminalSnapshot | null = null

  const clearTerminalSnapshot = () => {
    terminalSnapshot = null
  }

  const resetSession = () => {
    stopGameplayMutation()
    cleanupSessionEffects()
    beginSessionGeneration()
    clearTerminalSnapshot()
    resetCoreSessionState()
    resetWorldState()
    resetVisualAndRenderState()
  }

  const initializeCleanLevelOne = () => {
    resetSession()
    initializeLevelOne()
  }

  return {
    getState: lifecycle.getState,
    subscribe: lifecycle.subscribe,
    getTerminalSnapshot: () => terminalSnapshot,
    resetSession,
    startSession: () => {
      if (!lifecycle.startSession()) return false

      initializeCleanLevelOne()
      return lifecycle.activateGameplay()
    },
    playAgain: () => {
      if (!lifecycle.playAgain()) return false

      initializeCleanLevelOne()
      return lifecycle.activateGameplay()
    },
    returnToMainMenu: () => {
      if (!lifecycle.returnToMainMenu()) return false

      resetSession()
      return true
    },
    setGameOverSnapshot: (snapshot) => {
      if (!lifecycle.reportGameOver()) return false

      terminalSnapshot = snapshot
      return true
    },
    setVictorySnapshot: (snapshot) => {
      if (lifecycle.getState() === 'active-gameplay' && !lifecycle.completeLevel()) {
        return false
      }
      if (!lifecycle.reportVictory()) return false

      terminalSnapshot = snapshot
      return true
    },
    pause: lifecycle.pause,
    resume: lifecycle.resume,
  }
}
