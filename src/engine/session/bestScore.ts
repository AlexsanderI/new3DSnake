export const BEST_SCORE_STORAGE_KEY = 'snake3d.bestScore'

export interface BestScoreStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export interface BestScoreRecordResult {
  bestScore: number
  didUpdate: boolean
}

function getBrowserStorage(): BestScoreStorage | undefined {
  return typeof localStorage === 'undefined' ? undefined : localStorage
}

export function parseBestScore(value: string | null): number {
  if (value === null || value.trim() === '') return 0

  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed >= 0 && Number.isFinite(parsed) ? parsed : 0
}

export function readBestScore(storage = getBrowserStorage()): number {
  if (storage === undefined) return 0

  try {
    return parseBestScore(storage.getItem(BEST_SCORE_STORAGE_KEY))
  } catch {
    return 0
  }
}

export function recordBestScore(
  score: number,
  storage = getBrowserStorage(),
): BestScoreRecordResult {
  const currentBestScore = readBestScore(storage)

  if (!Number.isInteger(score) || score < 0 || score <= currentBestScore) {
    return {
      bestScore: currentBestScore,
      didUpdate: false,
    }
  }

  if (storage === undefined) {
    return {
      bestScore: score,
      didUpdate: false,
    }
  }

  try {
    storage.setItem(BEST_SCORE_STORAGE_KEY, String(score))

    return {
      bestScore: score,
      didUpdate: true,
    }
  } catch {
    return {
      bestScore: score,
      didUpdate: false,
    }
  }
}
