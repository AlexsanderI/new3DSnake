import { useRef } from 'react'
import type { VictorySnapshot } from '../engine/session/resultSnapshots'
import { useFocusPrimaryAction } from './useFocusPrimaryAction'

export interface VictoryResultActions {
  onPlayAgain: () => boolean
  onMainMenu: () => boolean
}

interface VictoryResultOverlayProps {
  snapshot: Readonly<VictorySnapshot>
  actions: VictoryResultActions
}

export function VictoryResultOverlay({
  snapshot,
  actions,
}: VictoryResultOverlayProps) {
  const primaryActionRef = useRef<HTMLButtonElement>(null)
  useFocusPrimaryAction(primaryActionRef)

  return (
    <div
      className='menu-game__result'
      role='dialog'
      aria-modal='true'
      aria-labelledby='victory-title'
    >
      <h2 id='victory-title'>Victory</h2>
      <dl className='menu-game__result-list'>
        <div>
          <dt>Final Score</dt>
          <dd>{snapshot.score}</dd>
        </div>
        <div>
          <dt>Best Score</dt>
          <dd>{snapshot.bestScore}</dd>
        </div>
        <div>
          <dt>Levels Completed</dt>
          <dd>{snapshot.levelsCompleted}</dd>
        </div>
      </dl>
      <div className='menu-game__actions'>
        <button type='button' ref={primaryActionRef} onClick={actions.onPlayAgain}>
          Play Again
        </button>
        <button type='button' onClick={actions.onMainMenu}>
          Main Menu
        </button>
      </div>
    </div>
  )
}
