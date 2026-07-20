import type { GameOverSnapshot } from '../engine/session/resultSnapshots'

export interface GameOverResultActions {
  onPlayAgain: () => void
  onMainMenu: () => void
}

interface GameOverResultOverlayProps {
  snapshot: Readonly<GameOverSnapshot>
  actions: GameOverResultActions
}

export function GameOverResultOverlay({
  snapshot,
  actions,
}: GameOverResultOverlayProps) {
  return (
    <div className='menu-game__result' role='dialog' aria-labelledby='game-over-title'>
      <h2 id='game-over-title'>Game Over</h2>
      <dl className='menu-game__result-list'>
        <div>
          <dt>Score</dt>
          <dd>{snapshot.score}</dd>
        </div>
        <div>
          <dt>Best Score</dt>
          <dd>{snapshot.bestScore}</dd>
        </div>
        <div>
          <dt>Level Reached</dt>
          <dd>{snapshot.levelReached}</dd>
        </div>
        <div>
          <dt>Failure Reason</dt>
          <dd>{snapshot.failureReason}</dd>
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
