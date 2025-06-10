import { describe, expect, it } from 'vitest'

import { LiquidityProvideBins } from '../../../types'
import { createCurveShape } from './curve-shape'

describe('createCurveShape', () => {
  describe('both sides of active bin', () => {
    it('return the correct shape #1', () => {
      const token0Amount = 1000000000n
      const token1Amount = 1000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 219,
        toBin: 247,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('return the correct shape #2', () => {
      const token0Amount = 9000000000n
      const token1Amount = 2000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 226,
        toBin: 241,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('fallback ratio should work', () => {
      const token0Amount = 10000000000n
      const token1Amount = 10000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 224,
        toBin: 240,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('real case bug - providing tokens were bigger than balance', () => {
      const token0Amount = 999578606801892483n
      const token1Amount = 9987892710478n

      const shape = createCurveShape({
        bps: 5n,
        currentPrice: 0.001,
        fromBin: -13969,
        toBin: -13710,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })
  })

  describe('left side of active bin', () => {
    it('including active bin', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 227,
        toBin: 232,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const token0Amount = 0n
      const token1Amount = 2000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 227,
        toBin: 231,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from right side', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 227,
        toBin: 231,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })
  })

  describe('right side of active bin', () => {
    it('including active bin', () => {
      const token0Amount = 1_000_000_000n
      const token1Amount = 2_000_000_000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 232,
        toBin: 246,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const token0Amount = 1000000000n
      const token1Amount = 0n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 246,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from left side', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 246,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })
  })

  describe('with fallback ratio', () => {
    it('ignore tokens from left side', () => {
      const token0Amount = 1n * 10n ** 6n
      const token1Amount = 10n * 10n ** 9n

      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 100,
        fromBin: 455,
        toBin: 469,
        token0Amount,
        token1Amount,
      })

      const sum = sumAmounts(shape)

      expect(sum[0]).toBeLessThanOrEqual(token0Amount)
      expect(sum[1]).toBeLessThanOrEqual(token1Amount)
      expect(shape).toMatchSnapshot()
    })
  })
})

const sumAmounts = (shape: LiquidityProvideBins) => {
  return Object.values(shape).reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0n, 0n])
}
