import type { VictorySnapshot } from '../engine/session/resultSnapshots'

export interface VictoryResultActions {
  onPlayAgain: () => void
  onMainMenu: () => void
}

interface VictoryResultOverlayProps {
  snapshot: Readonly<VictorySnapshot>
  actions: VictoryResultActions
}

export function VictoryResultOverlay({
  snapshot,
  actions,
}: VictoryResultOverlayProps) {
  return (
    <div className='menu-game__result' role='dialog' aria-labelledby='victory-title'>
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
        <button type='button' onClick={actions.onPlayAgain}>
          Play Again
        </button>
        <button type='button' onClick={actions.onMainMenu}>
          Main Menu
        </button>
      </div>
    </div>
  )
}
