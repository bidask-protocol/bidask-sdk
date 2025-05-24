import { describe, expect, it } from 'vitest'

import { calculateCentralAmountXByAmountY, calculateCentralAmountYByAmountX } from './central-bin'

describe('calculateCentralAmountXByAmountY', () => {
  it('should correctly convert amount of tokenY to amount of tokenX', () => {
    expect(calculateCentralAmountXByAmountY(1, 1.000180535890587, 5n)).toEqual(1.7687094703000172)
    expect(calculateCentralAmountXByAmountY(1, Number.MAX_VALUE, 5n)).toEqual(0)
  })
})

describe('calculateCentralAmountYByAmountX', () => {
  it('should correctly convert amount of tokenX to amount of tokenY', () => {
    expect(calculateCentralAmountYByAmountX(1, 1.000180535890587, 5n)).toEqual(0.5653839801233014)
    expect(calculateCentralAmountYByAmountX(1, 0.0000000000000000000001, 5n)).toEqual(0)
  })
})
