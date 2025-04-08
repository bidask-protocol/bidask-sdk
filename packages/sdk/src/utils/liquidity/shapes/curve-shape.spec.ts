import { describe, expect, it } from 'vitest'

import { createCurveShape } from './curve-shape'

describe('createCurveShape', () => {
  describe('both sides of active bin', () => {
    it('return the correct shape #1', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 219,
        toBin: 247,
        token0Amount: 1000000000n,
        token1Amount: 1000000000n,
      })

      expect(shape).toMatchSnapshot()
    })

    it('return the correct shape #2', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 226,
        toBin: 241,
        token0Amount: 9000000000n,
        token1Amount: 2000000000n,
      })

      expect(shape).toMatchSnapshot()
    })
  })

  describe('left side of active bin', () => {
    it('including active bin', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 227,
        toBin: 232,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
      })

      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 227,
        toBin: 231,
        token0Amount: 0n,
        token1Amount: 2000000000n,
      })

      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from right side', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 227,
        toBin: 231,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
      })

      expect(shape).toMatchSnapshot()
    })
  })

  describe('right side of active bin', () => {
    it('including active bin', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 232,
        toBin: 246,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
      })

      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 246,
        token0Amount: 1000000000n,
        token1Amount: 0n,
      })

      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from left side', () => {
      const shape = createCurveShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 246,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
      })

      expect(shape).toMatchSnapshot()
    })
  })
})
