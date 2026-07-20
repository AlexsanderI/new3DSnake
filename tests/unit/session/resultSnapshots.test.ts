import { describe, expect, it, vi } from 'vitest'
import { BEST_SCORE_STORAGE_KEY } from '../../../src/engine/session/bestScore'
import {
  createGameOverSnapshot,
  createVictorySnapshot,
  mapFailureReason,
} from '../../../src/engine/session/resultSnapshots'

describe('terminal result snapshots', () => {
  it.each([
    ['no moves', 'no available moves'],
    ['time limit', 'time expired'],
    ['lives limit', 'no lives remaining'],
  ] as const)('maps %s to %s', (engineReason, playerReason) => {
    expect(mapFailureReason(engineReason)).toBe(playerReason)
  })

  it('creates an immutable Game Over snapshot before any reset work', () => {
    const storage = {
      getItem: vi.fn(() => '20'),
      setItem: vi.fn(),
    }

    const snapshot = createGameOverSnapshot(
      {
        score: 25,
        levelReached: 3,
        failureReason: 'no moves',
      },
      storage,
    )

    expect(snapshot).toEqual({
      kind: 'game-over',
      score: 25,
      bestScore: 25,
      levelReached: 3,
      failureReason: 'no available moves',
    })
    expect(Object.isFrozen(snapshot)).toBe(true)
    expect(storage.setItem).toHaveBeenCalledWith(BEST_SCORE_STORAGE_KEY, '25')
  })

  it('creates an immutable Victory snapshot before any reset work', () => {
    const storage = {
      getItem: vi.fn(() => '50'),
      setItem: vi.fn(),
    }

    const snapshot = createVictorySnapshot(
      {
        score: 40,
        levelsCompleted: 5,
      },
      storage,
    )

    expect(snapshot).toEqual({
      kind: 'victory',
      score: 40,
      bestScore: 50,
      levelsCompleted: 5,
    })
    expect(Object.isFrozen(snapshot)).toBe(true)
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('creates snapshots when storage read and write operations throw', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('read failed')
      }),
      setItem: vi.fn(() => {
        throw new Error('write failed')
      }),
    }

    expect(
      createGameOverSnapshot(
        {
          score: 12,
          levelReached: 2,
          failureReason: 'time limit',
        },
        storage,
      ),
    ).toEqual({
      kind: 'game-over',
      score: 12,
      bestScore: 12,
      levelReached: 2,
      failureReason: 'time expired',
    })
  })
})
