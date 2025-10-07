import { toNano } from '@ton/ton'
import { describe, expect, it } from 'vitest'

import { calculateTokenYToAddByTokenX } from './virtual-tokens'

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
})
