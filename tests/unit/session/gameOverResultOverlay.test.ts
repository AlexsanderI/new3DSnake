import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import {
  GameOverResultOverlay,
  type GameOverResultActions,
} from '../../../src/components/GameOverResultOverlay'
import type { GameOverSnapshot } from '../../../src/engine/session/resultSnapshots'

const snapshot: Readonly<GameOverSnapshot> = Object.freeze({
  kind: 'game-over',
  score: 42,
  bestScore: 99,
  levelReached: 4,
  failureReason: 'no available moves',
})

function createActions(): GameOverResultActions {
  return {
    onPlayAgain: vi.fn(),
    onMainMenu: vi.fn(),
  }
}

describe('GameOverResultOverlay', () => {
  it('renders the required Game Over result fields from an immutable snapshot', () => {
    const html = renderToStaticMarkup(
      React.createElement(GameOverResultOverlay, {
        snapshot,
        actions: createActions(),
      }),
    )

    expect(html).toContain('Game Over')
    expect(html).toContain('Score')
    expect(html).toContain('42')
    expect(html).toContain('Best Score')
    expect(html).toContain('99')
    expect(html).toContain('Level Reached')
    expect(html).toContain('4')
    expect(html).toContain('Failure Reason')
    expect(html).toContain('no available moves')
    expect(html).toContain('Play Again')
    expect(html).toContain('Main Menu')
    expect(html).toContain('<button')
  })

  it('keeps result values stable because rendering uses the snapshot object', () => {
    const first = renderToStaticMarkup(
      React.createElement(GameOverResultOverlay, {
        snapshot,
        actions: createActions(),
      }),
    )
    const second = renderToStaticMarkup(
      React.createElement(GameOverResultOverlay, {
        snapshot,
        actions: createActions(),
      }),
    )

    expect(second).toBe(first)
  })
})
