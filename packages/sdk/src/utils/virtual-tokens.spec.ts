import { toNano } from '@ton/ton'
import { describe, expect, it } from 'vitest'

import { calculateTokenYToAddByTokenX, calculateVirtualTokensWithBoundsFromY } from './virtual-tokens'

describe('virtual-tokens', () => {
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

  describe('calculateVirtualTokensWithBoundsFromY', () => {
    it('should return the correct virtual tokens', () => {
      const tokenYAmount = toNano(1)
      const priceLower = 1
      const priceUpper = Number.POSITIVE_INFINITY
      const currentPrice = 1.5

      const { virtualXAmount, virtualYAmount, tokenXAmount: tokenXAmountResult } = calculateVirtualTokensWithBoundsFromY(priceLower, priceUpper, currentPrice, tokenYAmount)

      expect(virtualXAmount).toBe(0n)
      expect(virtualYAmount).toBe(2000000000n)
      expect(tokenXAmountResult).toBe(2000000000n)
    })
  })
})
