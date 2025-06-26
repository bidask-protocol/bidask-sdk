import { describe, expect, it } from 'vitest'

import { createBidaskShape } from './bidask-shape'

describe('createBidaskShape', () => {
  describe('both sides of active bin', () => {
    it('return the correct shape #1', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 222,
        toBin: 243,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })

    it('return the correct shape #2', () => {
      const token0Amount = 9000000000n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 224,
        toBin: 240,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })
  })

  describe('left side of active bin', () => {
    it('including active bin', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 223,
        toBin: 232,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const token0Amount = 0n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 223,
        toBin: 231,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })

    it('ignore tokens from right side', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 243,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })
  })

  describe('right side of active bin', () => {
    it('including active bin', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 232,
        toBin: 242,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const token0Amount = 1000000000n
      const token1Amount = 0n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 242,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })

    it('ignore tokens from left side', () => {
      const token0Amount = 1000000000n
      const token1Amount = 2000000000n

      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 243,
        token0Amount,
        token1Amount,
      })

      expect(shape.bins).toMatchSnapshot()
    })
  })
})
