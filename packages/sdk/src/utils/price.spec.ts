import { describe, expect, it } from 'vitest'

import { getPriceFromSqrtPriceX128, getSqrtPriceX128 } from './price'

describe('getSqrtPriceX128', () => {
  it('should return the correct sqrt price X 128', () => {
    expect(getSqrtPriceX128(1)).toBe(340282366920938463463374607431768211456n)
    expect(getSqrtPriceX128(2)).toBe(481231938336009023089492901884097360453n)
  })
})

describe('getPriceFromSqrtPriceX128', () => {
  it('should return the correct price', () => {
    expect(getPriceFromSqrtPriceX128(340282366920938463463374607431768211456n)).toBe(1)
    expect(getPriceFromSqrtPriceX128(481231938336009023089492901884097360453n)).toBe(2)
  })
})
