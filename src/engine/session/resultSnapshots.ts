import { recordBestScore, type BestScoreStorage } from './bestScore'

export type EngineFailureReason = 'no moves' | 'time limit' | 'lives limit'

export type GameOverFailureReason =
  | 'no available moves'
  | 'time expired'
  | 'no lives remaining'

export interface GameOverSnapshotInput {
  score: number
  levelReached: number
  failureReason: EngineFailureReason
}

export interface VictorySnapshotInput {
  score: number
  levelsCompleted: number
}

export interface GameOverSnapshot {
  kind: 'game-over'
  score: number
  bestScore: number
  levelReached: number
  failureReason: GameOverFailureReason
}

export interface VictorySnapshot {
  kind: 'victory'
  score: number
  bestScore: number
  levelsCompleted: number
}

const failureReasonMap: Record<EngineFailureReason, GameOverFailureReason> = {
  'no moves': 'no available moves',
  'time limit': 'time expired',
  'lives limit': 'no lives remaining',
}

export function mapFailureReason(reason: EngineFailureReason): GameOverFailureReason {
  return failureReasonMap[reason]
}

export function createGameOverSnapshot(
  input: GameOverSnapshotInput,
  storage?: BestScoreStorage,
): Readonly<GameOverSnapshot> {
  const { bestScore } = recordBestScore(input.score, storage)

  return Object.freeze({
    kind: 'game-over',
    score: input.score,
    bestScore,
    levelReached: input.levelReached,
    failureReason: mapFailureReason(input.failureReason),
  })
}

export function createVictorySnapshot(
  input: VictorySnapshotInput,
  storage?: BestScoreStorage,
): Readonly<VictorySnapshot> {
  const { bestScore } = recordBestScore(input.score, storage)

  return Object.freeze({
    kind: 'victory',
    score: input.score,
    bestScore,
    levelsCompleted: input.levelsCompleted,
  })
}
