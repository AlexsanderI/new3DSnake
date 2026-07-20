import { getCurrentLevel } from '../levels/currentLevel'
import { getProtocol } from '../protocol/protocol'
import { getScores } from '../scores/scores'
import { stopTimer } from '../time/isTimer'
import type { BestScoreStorage } from './bestScore'
import { createGameOverSnapshot, type EngineFailureReason } from './resultSnapshots'
import type { SessionCommands } from './sessionCommands'

interface ProtocolStorage {
  setItem: (key: string, value: string) => void
}

export interface GameOverReportOptions {
  session?: SessionCommands
  storage?: BestScoreStorage
  protocolStorage?: ProtocolStorage | null
}

let defaultSession: SessionCommands | null = null

export function setDefaultGameOverReportSession(session: SessionCommands): void {
  defaultSession = session
}

function getDefaultProtocolStorage(): ProtocolStorage | null {
  if (typeof localStorage === 'undefined') return null

  return localStorage
}

function persistProtocol(storage: ProtocolStorage | null): void {
  if (storage === null) return

  try {
    storage.setItem('protocol', JSON.stringify(getProtocol()))
  } catch {
    // Protocol export is diagnostic only; result reporting must still succeed.
  }
}

export function reportGameOver(
  reason: EngineFailureReason,
  options: GameOverReportOptions = {},
): boolean {
  const session = options.session ?? defaultSession
  if (session === null) return false
  if (session.getState() !== 'active-gameplay') return false

  const snapshot = createGameOverSnapshot(
    {
      score: getScores(),
      levelReached: getCurrentLevel(),
      failureReason: reason,
    },
    options.storage,
  )

  const reported = session.setGameOverSnapshot(snapshot)
  if (!reported) return false

  stopTimer()
  persistProtocol(
    options.protocolStorage === undefined
      ? getDefaultProtocolStorage()
      : options.protocolStorage,
  )

  return true
}
