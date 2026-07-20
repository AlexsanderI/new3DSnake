import { describe, expect, it, vi } from 'vitest'
import {
  createLifecycleController,
  lifecycleStates,
  type LifecycleState,
} from '../../../src/engine/session/lifecycleController'

const gameplayFactKeys = [
  'score',
  'scores',
  'lives',
  'timer',
  'snake',
  'food',
  'bonus',
  'bonuses',
  'obstacle',
  'obstacles',
  'animation',
] as const

describe('lifecycle controller', () => {
  it('starts in main-menu with the required lifecycle states available', () => {
    const controller = createLifecycleController()

    expect(lifecycleStates).toEqual([
      'main-menu',
      'starting-session',
      'active-gameplay',
      'paused',
      'level-complete',
      'game-over',
      'victory',
    ])
    expect(controller.getState()).toBe('main-menu')
  })

  it('applies allowed lifecycle transitions', () => {
    const controller = createLifecycleController()

    expect(controller.startSession()).toBe(true)
    expect(controller.getState()).toBe('starting-session')

    expect(controller.activateGameplay()).toBe(true)
    expect(controller.getState()).toBe('active-gameplay')

    expect(controller.pause()).toBe(true)
    expect(controller.getState()).toBe('paused')

    expect(controller.resume()).toBe(true)
    expect(controller.getState()).toBe('active-gameplay')

    expect(controller.completeLevel()).toBe(true)
    expect(controller.getState()).toBe('level-complete')

    expect(controller.continueToNextLevel()).toBe(true)
    expect(controller.getState()).toBe('active-gameplay')

    expect(controller.reportGameOver()).toBe(true)
    expect(controller.getState()).toBe('game-over')

    expect(controller.playAgain()).toBe(true)
    expect(controller.getState()).toBe('starting-session')

    expect(controller.activateGameplay()).toBe(true)
    expect(controller.completeLevel()).toBe(true)
    expect(controller.reportVictory()).toBe(true)
    expect(controller.getState()).toBe('victory')

    expect(controller.returnToMainMenu()).toBe(true)
    expect(controller.getState()).toBe('main-menu')
  })

  it('ignores invalid commands without changing state or notifying subscribers', () => {
    const controller = createLifecycleController()
    const listener = vi.fn()
    controller.subscribe(listener)

    expect(controller.pause()).toBe(false)
    expect(controller.resume()).toBe(false)
    expect(controller.reportGameOver()).toBe(false)
    expect(controller.reportVictory()).toBe(false)
    expect(controller.returnToMainMenu()).toBe(false)

    expect(controller.getState()).toBe('main-menu')
    expect(listener).not.toHaveBeenCalled()
  })

  it('notifies subscribers only for real state changes and supports unsubscribe', () => {
    const controller = createLifecycleController()
    const listener = vi.fn<[LifecycleState, LifecycleState], void>()
    const unsubscribe = controller.subscribe(listener)

    controller.pause()
    controller.startSession()
    controller.startSession()
    controller.activateGameplay()
    unsubscribe()
    controller.pause()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(listener).toHaveBeenNthCalledWith(1, 'starting-session', 'main-menu')
    expect(listener).toHaveBeenNthCalledWith(2, 'active-gameplay', 'starting-session')
    expect(controller.getState()).toBe('paused')
  })

  it('keeps controller state lifecycle-only without live gameplay facts', () => {
    const controller = createLifecycleController()

    for (const key of gameplayFactKeys) {
      expect(key in controller).toBe(false)
    }
    expect(typeof controller.getState()).toBe('string')
  })
})
