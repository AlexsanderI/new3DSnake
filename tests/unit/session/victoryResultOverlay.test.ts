import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import {
  VictoryResultOverlay,
  type VictoryResultActions,
} from '../../../src/components/VictoryResultOverlay'
import type { VictorySnapshot } from '../../../src/engine/session/resultSnapshots'

const snapshot: Readonly<VictorySnapshot> = Object.freeze({
  kind: 'victory',
  score: 64,
  bestScore: 128,
  levelsCompleted: 4,
})

function createActions(): VictoryResultActions {
  return {
    onPlayAgain: vi.fn(),
    onMainMenu: vi.fn(),
  }
}

describe('VictoryResultOverlay', () => {
  it('renders required Victory result fields from an immutable snapshot', () => {
    const html = renderToStaticMarkup(
      React.createElement(VictoryResultOverlay, {
        snapshot,
        actions: createActions(),
      }),
    )

    expect(html).toContain('Victory')
    expect(html).toContain('Final Score')
    expect(html).toContain('64')
    expect(html).toContain('Best Score')
    expect(html).toContain('128')
    expect(html).toContain('Levels Completed')
    expect(html).toContain('4')
    expect(html).toContain('Play Again')
    expect(html).toContain('Main Menu')
    expect(html).toContain('<button')
  })

  it('keeps result values stable because rendering uses the snapshot object', () => {
    const first = renderToStaticMarkup(
      React.createElement(VictoryResultOverlay, {
        snapshot,
        actions: createActions(),
      }),
    )
    const second = renderToStaticMarkup(
      React.createElement(VictoryResultOverlay, {
        snapshot,
        actions: createActions(),
      }),
    )

    expect(second).toBe(first)
  })
})
