import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  beginSessionGeneration,
  cleanupSessionEffects,
  getSessionEffectCount,
  getSessionGeneration,
  registerSessionInterval,
  registerSessionTimeout,
} from '../../../src/engine/session/sessionEffects'

describe('session temporary effect registry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    cleanupSessionEffects()
    beginSessionGeneration()
  })

  afterEach(() => {
    cleanupSessionEffects()
    vi.useRealTimers()
  })

  it('clears a registered timeout before it executes and empties the registry', () => {
    let calls = 0

    registerSessionTimeout(() => {
      calls += 1
    }, 100)

    expect(getSessionEffectCount()).toBe(1)
    cleanupSessionEffects()
    vi.advanceTimersByTime(100)

    expect(calls).toBe(0)
    expect(getSessionEffectCount()).toBe(0)
  })

  it('stops a registered interval after cleanup and remains idempotent', () => {
    let calls = 0

    registerSessionInterval(() => {
      calls += 1
    }, 50)

    vi.advanceTimersByTime(110)
    expect(calls).toBe(2)

    cleanupSessionEffects()
    cleanupSessionEffects()
    vi.advanceTimersByTime(150)

    expect(calls).toBe(2)
    expect(getSessionEffectCount()).toBe(0)
  })

  it('ignores old-generation callbacks while current-generation callbacks still run', () => {
    let oldCalls = 0
    let currentCalls = 0
    const firstGeneration = getSessionGeneration()

    registerSessionTimeout(() => {
      oldCalls += 1
    }, 100)

    beginSessionGeneration()
    expect(getSessionGeneration()).toBe(firstGeneration + 1)

    registerSessionTimeout(() => {
      currentCalls += 1
    }, 100)

    vi.advanceTimersByTime(100)

    expect(oldCalls).toBe(0)
    expect(currentCalls).toBe(1)
    expect(getSessionEffectCount()).toBe(0)
  })
})
