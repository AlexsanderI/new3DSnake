import { describe, expect, it } from 'vitest'
import mulberry32 from '../../src/commands/mulberry32'

describe('mulberry32', () => {
  it('returns a repeatable sequence for the same seed', () => {
    const first = mulberry32(12345)
    const second = mulberry32(12345)

    expect([first(), first(), first()]).toEqual([second(), second(), second()])
  })

  it('keeps generated values inside the Math.random range', () => {
    const random = mulberry32(42)

    const values = Array.from({ length: 20 }, () => random())

    expect(values.every((value) => value >= 0 && value < 1)).toBe(true)
  })
})
