import { describe, expect, it } from 'vitest'

import { createSpotShape } from './spot-shape'

describe('createSpotShape', () => {
  describe('both sides of active bin', () => {
    it('return the correct shape #1', () => {
      const shape = createSpotShape({
        bps: 60n,
        currentPrice: 1,
        fromBin: -10,
        toBin: 10,
        token0Amount: 1000000000n,
        token1Amount: 1000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('return the correct shape #2', () => {
      const shape = createSpotShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 225,
        toBin: 239,
        token0Amount: 1000000000n,
        token1Amount: 1000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    describe('left side of active bin', () => {
      it('including active bin', () => {
        const shape = createSpotShape({
          bps: 100n,
          currentPrice: 10.0852,
          fromBin: 221,
          toBin: 232,
          token0Amount: 1000000000n,
          token1Amount: 1000000000n,
          ratio: 1,
        })

        expect(shape).toMatchSnapshot()
      })

      it('excluding active bin', () => {
        const shape = createSpotShape({
          bps: 100n,
          currentPrice: 10.0852,
          fromBin: 219,
          toBin: 231,
          token0Amount: 1000000000n,
          token1Amount: 1000000000n,
          ratio: 1,
        })

        expect(shape).toMatchSnapshot()
      })

      it('ignore tokens from right side', () => {
        const shape = createSpotShape({
          bps: 100n,
          currentPrice: 10.0852,
          fromBin: 219,
          toBin: 231,
          token0Amount: 1000000000n,
          token1Amount: 1000000000n,
          ratio: 1,
        })

        expect(shape).toMatchSnapshot()
      })
    })
  })

  describe('right side of active bin', () => {
    it('including active bin', () => {
      const shape = createSpotShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 232,
        toBin: 250,
        token0Amount: 1000000000n,
        token1Amount: 1000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const shape = createSpotShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 250,
        token0Amount: 1000000000n,
        token1Amount: 1000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from left side', () => {
      const shape = createSpotShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 250,
        token0Amount: 1000000000n,
        token1Amount: 1000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })
  })
})
