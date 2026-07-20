import { describe, expect, it, vi } from 'vitest'
import {
  BEST_SCORE_STORAGE_KEY,
  readBestScore,
  recordBestScore,
  type BestScoreStorage,
} from '../../../src/engine/session/bestScore'

function createStorage(initialValue: string | null = null): BestScoreStorage {
  let value = initialValue

  return {
    getItem: vi.fn((key: string) => (key === BEST_SCORE_STORAGE_KEY ? value : null)),
    setItem: vi.fn((key: string, nextValue: string) => {
      if (key === BEST_SCORE_STORAGE_KEY) value = nextValue
    }),
  }
}

describe('best score service', () => {
  it.each([
    ['missing', null],
    ['invalid', 'not-a-number'],
    ['negative', '-1'],
    ['fractional', '12.5'],
    ['NaN', 'NaN'],
    ['Infinity', 'Infinity'],
  ])('reads %s stored values as zero', (_, storedValue) => {
    expect(readBestScore(createStorage(storedValue))).toBe(0)
  })

  it('reads valid non-negative integer values', () => {
    expect(readBestScore(createStorage('42'))).toBe(42)
  })

  it('does not overwrite the stored best score for lower or equal scores', () => {
    const lowerStorage = createStorage('100')
    const equalStorage = createStorage('100')

    expect(recordBestScore(90, lowerStorage)).toEqual({
      bestScore: 100,
      didUpdate: false,
    })
    expect(recordBestScore(100, equalStorage)).toEqual({
      bestScore: 100,
      didUpdate: false,
    })
    expect(lowerStorage.setItem).not.toHaveBeenCalled()
    expect(equalStorage.setItem).not.toHaveBeenCalled()
  })

  it('updates the stored best score for higher scores using a namespaced key', () => {
    const storage = createStorage('100')

    expect(recordBestScore(101, storage)).toEqual({
      bestScore: 101,
      didUpdate: true,
    })
    expect(storage.setItem).toHaveBeenCalledWith(BEST_SCORE_STORAGE_KEY, '101')
    expect(readBestScore(storage)).toBe(101)
  })

  it('treats storage read failures as zero without throwing', () => {
    const storage: BestScoreStorage = {
      getItem: vi.fn(() => {
        throw new Error('read failed')
      }),
      setItem: vi.fn(),
    }

    expect(() => readBestScore(storage)).not.toThrow()
    expect(readBestScore(storage)).toBe(0)
  })

  it('does not block best-score recording when storage write fails', () => {
    const storage: BestScoreStorage = {
      getItem: vi.fn(() => '10'),
      setItem: vi.fn(() => {
        throw new Error('write failed')
      }),
    }

    expect(() => recordBestScore(15, storage)).not.toThrow()
    expect(recordBestScore(15, storage)).toEqual({
      bestScore: 15,
      didUpdate: false,
    })
  })
})
