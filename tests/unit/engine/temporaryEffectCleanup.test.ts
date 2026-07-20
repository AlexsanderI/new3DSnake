import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { cleanupSessionEffects, beginSessionGeneration } from '../../../src/engine/session/sessionEffects'
import { getLives, setLivesCount } from '../../../src/engine/lives/lives'
import { mistakeWasMade, resetMistake } from '../../../src/engine/lives/isMistake'
import lifeLost from '../../../src/engine/protocol/lifeLost'
import {
  clearGameFinishTimeout,
  scheduleGameFinishTimeout,
  type GameFinishTimeoutRef,
} from '../../../src/components/gameFinishTimeout'

describe('session temporary effect cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    cleanupSessionEffects()
    beginSessionGeneration()
    resetMistake()
    setLivesCount(0)
  })

  afterEach(() => {
    cleanupSessionEffects()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('prevents lifeLost delayed callbacks from mutating HUD after cleanup', () => {
    const lifeElement = { style: { opacity: '1' } }
    vi.stubGlobal('document', {
      querySelector: (selector: string) =>
        selector === '.fa-heart' ? lifeElement : null,
      querySelectorAll: () => [],
    })

    setLivesCount(2)
    mistakeWasMade()

    lifeLost()
    expect(getLives()).toBe(1)

    cleanupSessionEffects()
    vi.advanceTimersByTime(600)

    expect(lifeElement.style.opacity).toBe('1')
  })

  it('ignores lifeLost callbacks from an old session generation', () => {
    const lifeElement = { style: { opacity: '1' } }
    vi.stubGlobal('document', {
      querySelector: (selector: string) =>
        selector === '.fa-heart' ? lifeElement : null,
      querySelectorAll: () => [],
    })

    setLivesCount(2)
    mistakeWasMade()

    lifeLost()
    beginSessionGeneration()
    vi.advanceTimersByTime(600)

    expect(lifeElement.style.opacity).toBe('1')
  })

  it('cancels Game-owned finish timeout and tolerates StrictMode-like cleanup', () => {
    const ref: GameFinishTimeoutRef = { current: null }
    let hidden = false

    scheduleGameFinishTimeout(ref, () => {
      hidden = true
    })
    scheduleGameFinishTimeout(ref, () => {
      hidden = true
    })

    clearGameFinishTimeout(ref)
    clearGameFinishTimeout(ref)
    vi.advanceTimersByTime(500)

    expect(hidden).toBe(false)
    expect(ref.current).toBeNull()
  })
})
