export const lifecycleStates = [
  'main-menu',
  'starting-session',
  'active-gameplay',
  'paused',
  'level-complete',
  'game-over',
  'victory',
] as const

export type LifecycleState = (typeof lifecycleStates)[number]

type LifecycleListener = (
  nextState: LifecycleState,
  previousState: LifecycleState,
) => void

type LifecycleCommand =
  | 'startSession'
  | 'activateGameplay'
  | 'pause'
  | 'resume'
  | 'completeLevel'
  | 'continueToNextLevel'
  | 'reportGameOver'
  | 'reportVictory'
  | 'playAgain'
  | 'returnToMainMenu'

export interface LifecycleController {
  getState: () => LifecycleState
  subscribe: (listener: LifecycleListener) => () => void
  startSession: () => boolean
  activateGameplay: () => boolean
  pause: () => boolean
  resume: () => boolean
  completeLevel: () => boolean
  continueToNextLevel: () => boolean
  reportGameOver: () => boolean
  reportVictory: () => boolean
  playAgain: () => boolean
  returnToMainMenu: () => boolean
}

const transitions: Record<
  LifecycleCommand,
  Partial<Record<LifecycleState, LifecycleState>>
> = {
  startSession: {
    'main-menu': 'starting-session',
  },
  activateGameplay: {
    'starting-session': 'active-gameplay',
  },
  pause: {
    'active-gameplay': 'paused',
  },
  resume: {
    paused: 'active-gameplay',
  },
  completeLevel: {
    'active-gameplay': 'level-complete',
  },
  continueToNextLevel: {
    'level-complete': 'active-gameplay',
  },
  reportGameOver: {
    'active-gameplay': 'game-over',
  },
  reportVictory: {
    'level-complete': 'victory',
  },
  playAgain: {
    'game-over': 'starting-session',
    victory: 'starting-session',
  },
  returnToMainMenu: {
    'game-over': 'main-menu',
    victory: 'main-menu',
  },
}

export function createLifecycleController(
  initialState: LifecycleState = 'main-menu',
): LifecycleController {
  let state = initialState
  const listeners = new Set<LifecycleListener>()

  const setState = (nextState: LifecycleState): boolean => {
    if (nextState === state) return false

    const previousState = state
    state = nextState
    listeners.forEach((listener) => listener(nextState, previousState))
    return true
  }

  const command = (name: LifecycleCommand): boolean => {
    const nextState = transitions[name][state]

    return nextState === undefined ? false : setState(nextState)
  }

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
    startSession: () => command('startSession'),
    activateGameplay: () => command('activateGameplay'),
    pause: () => command('pause'),
    resume: () => command('resume'),
    completeLevel: () => command('completeLevel'),
    continueToNextLevel: () => command('continueToNextLevel'),
    reportGameOver: () => command('reportGameOver'),
    reportVictory: () => command('reportVictory'),
    playAgain: () => command('playAgain'),
    returnToMainMenu: () => command('returnToMainMenu'),
  }
}
