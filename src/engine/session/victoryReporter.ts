import { getMaxLevel } from '../levels/maxLevel'
import { getProtocol } from '../protocol/protocol'
import { getScores } from '../scores/scores'
import { stopTimer } from '../time/isTimer'
import type { BestScoreStorage } from './bestScore'
import { createVictorySnapshot } from './resultSnapshots'
import type { SessionCommands } from './sessionCommands'

interface ProtocolStorage {
  setItem: (key: string, value: string) => void
}

export interface VictoryReportOptions {
  session?: SessionCommands
  storage?: BestScoreStorage
  protocolStorage?: ProtocolStorage | null
}

let defaultSession: SessionCommands | null = null

export function setDefaultVictoryReportSession(session: SessionCommands): void {
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

export function reportVictory(options: VictoryReportOptions = {}): boolean {
  const session = options.session ?? defaultSession
  if (session === null) return false
  if (session.getState() !== 'active-gameplay') return false

  const snapshot = createVictorySnapshot(
    {
      score: getScores(),
      levelsCompleted: getMaxLevel(),
    },
    options.storage,
  )

  const reported = session.setVictorySnapshot(snapshot)
  if (!reported) return false

  stopTimer()
  persistProtocol(
    options.protocolStorage === undefined
      ? getDefaultProtocolStorage()
      : options.protocolStorage,
  )

  return true
}
