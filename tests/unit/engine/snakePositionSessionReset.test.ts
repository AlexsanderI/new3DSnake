import { describe, expect, it } from 'vitest'

import { setSnakePosition } from '../../../src/engine/snake/setSnakePosition'
import { startTimer } from '../../../src/engine/time/isTimer'
import { setTimerStep } from '../../../src/engine/time/timerStepPerLevel'
import { createSessionCommands } from '../../../src/engine/session/sessionCommands'
import { createGameOverSnapshot } from '../../../src/engine/session/resultSnapshots'
import { BEST_SCORE_STORAGE_KEY } from '../../../src/engine/session/bestScore'

function createMemoryStorage() {
  const values = new Map<string, string>()
  values.set(BEST_SCORE_STORAGE_KEY, '0')

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
  }
}

describe('snake position session reset', () => {
  it('uses default interpolation speed on the first movement after Play Again', () => {
    const storage = createMemoryStorage()
    const session = createSessionCommands({ bestScoreStorage: storage })

    expect(session.startSession()).toBe(true)

    startTimer()
    setTimerStep(5)
    setSnakePosition({ counterX: 0, counterY: 0 })

    expect(
      session.setGameOverSnapshot(
        createGameOverSnapshot(
          { score: 0, levelReached: 1, failureReason: 'lives limit' },
          storage,
        ),
      ),
    ).toBe(true)
    expect(session.playAgain()).toBe(true)

    startTimer()

    let position = { counterX: 0, counterY: 0 }
    for (let frame = 1; frame <= 13; frame += 1) {
      position = setSnakePosition({
        counterX: 0,
        counterY: frame / 60,
      })
    }

    expect(position.counterY).toBeCloseTo(13 / 60)
  })
})
