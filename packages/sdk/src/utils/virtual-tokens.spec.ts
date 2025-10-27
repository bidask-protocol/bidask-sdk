import { toNano } from '@ton/ton'
import { describe, expect, it } from 'vitest'

import {
  calculateTokenYToAddByTokenX,
  calculateVirtualTokens,
  calculateVirtualTokensWithBoundsFromX,
  calculateVirtualTokensWithBoundsFromY,
  calculatePriceBounds,
} from './virtual-tokens'

describe('virtual-tokens', () => {
  describe('calculateVirtualTokens', () => {
    it('case from docs', () => {
      const tokenXAmount = 10n
      const tokenYAmount = 10n
      const price = 5

      const { virtualXAmount, virtualYAmount } = calculateVirtualTokens(
        price,
        tokenXAmount,
        tokenYAmount,
      )

      expect(virtualXAmount).toBe(0n)
      expect(virtualYAmount).toBe(40n)
    })

    it('simple case', () => {
      const tokenXAmount = 1n
      const tokenYAmount = 100n
      const price = 100

      const { virtualXAmount, virtualYAmount } = calculateVirtualTokens(
        price,
        tokenXAmount,
        tokenYAmount,
      )

      expect(virtualXAmount).toBe(0n)
      expect(virtualYAmount).toBe(0n)
    })
  })

  describe('calculateTokenYToAddByTokenX', () => {
    it('real world example #1', () => {
      const poolTokenXAmount = 23000000000n
      const poolTokenYAmount = 73314057154n

      const tokenXToAdd = toNano(2)

      expect(calculateTokenYToAddByTokenX(poolTokenXAmount, poolTokenYAmount, tokenXToAdd)).toBe(
        6375135404n,
      )
    })
  })

  // describe('calculateVirtualTokensWithBoundsFromY', () => {
  //   it('should return the correct virtual tokens', () => {
  //     const tokenYAmount = toNano(1)
  //     const priceLower = 1
  //     const priceUpper = Number.POSITIVE_INFINITY
  //     const currentPrice = 1.5

  //     const { virtualXAmount, virtualYAmount, tokenXAmount: tokenXAmountResult } = calculateVirtualTokensWithBoundsFromY(priceLower, priceUpper, currentPrice, tokenYAmount)

  //     expect(virtualXAmount).toBe(0n)
  //     expect(virtualYAmount).toBe(2000000000n)
  //     expect(tokenXAmountResult).toBe(2000000000n)
  //   })
  // })

  describe('extractPriceBoundsFromVirtualTokens', () => {
    it.only('fully swapped pool (real case)', () => {
      const tokenXAmount = 0n;
      const tokenYAmount = 20150127505555n;
      const virtualXAmount = 20049875621120n;
      const virtualYAmount = 2004887310227534n;

      const { priceLower, priceUpper } = calculatePriceBounds(tokenXAmount, tokenYAmount, virtualXAmount, virtualYAmount);

      expect(priceLower).toBeCloseTo(99);
      expect(priceUpper).toBeCloseTo(101);
    })

    it('should extract bounds correctly from calculateVirtualTokensWithBoundsFromX', () => {
      // Setup: Use calculateVirtualTokensWithBoundsFromX to create test data
      const priceLower = 1.5
      const priceUpper = 3.0
      const currentPrice = 2.0
      const tokenXAmount = toNano(10)

      const { virtualXAmount, virtualYAmount, tokenYAmount } =
        calculateVirtualTokensWithBoundsFromX(priceLower, priceUpper, currentPrice, tokenXAmount)

      // Extract the bounds back
      const extracted = calculatePriceBounds(
        tokenXAmount,
        tokenYAmount,
        virtualXAmount,
        virtualYAmount,
      )

      // Verify we get the original bounds back (with floating point tolerance)
      expect(extracted.priceLower).toBeCloseTo(priceLower, 10)
      expect(extracted.priceUpper).toBeCloseTo(priceUpper, 10)
    })

    it('should extract bounds correctly from calculateVirtualTokensWithBoundsFromY', () => {
      // Setup: Use calculateVirtualTokensWithBoundsFromY to create test data
      const priceLower = 0.5
      const priceUpper = 2.5
      const currentPrice = 1.2
      const tokenYAmount = toNano(100)

      const { virtualXAmount, virtualYAmount, tokenXAmount } =
        calculateVirtualTokensWithBoundsFromY(priceLower, priceUpper, currentPrice, tokenYAmount)

      // Extract the bounds back
      const extracted = calculatePriceBounds(
        tokenXAmount,
        tokenYAmount,
        virtualXAmount,
        virtualYAmount,
      )

      // Verify we get the original bounds back (with floating point tolerance)
      expect(extracted.priceLower).toBeCloseTo(priceLower, 10)
      expect(extracted.priceUpper).toBeCloseTo(priceUpper, 10)
    })
  })
})
