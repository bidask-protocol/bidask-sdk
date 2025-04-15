import { describe, expect, it } from 'vitest'

import { createBidaskShape } from './bidask-shape'

describe('createBidaskShape', () => {
  describe('both sides of active bin', () => {
    it('return the correct shape #1', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 222,
        toBin: 243,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
        ratio: 1
      })

      expect(shape).toMatchSnapshot()
    })

    it('return the correct shape #2', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 224,
        toBin: 240,
        token0Amount: 9000000000n,
        token1Amount: 2000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })
  })

  describe('left side of active bin', () => {
    it('including active bin', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 223,
        toBin: 232,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 223,
        toBin: 231,
        token0Amount: 0n,
        token1Amount: 2000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from right side', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 243,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })
  })

  describe('right side of active bin', () => {
    it('including active bin', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 232,
        toBin: 242,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('excluding active bin', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 242,
        token0Amount: 1000000000n,
        token1Amount: 0n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })

    it('ignore tokens from left side', () => {
      const shape = createBidaskShape({
        bps: 100n,
        currentPrice: 10.0852,
        fromBin: 233,
        toBin: 243,
        token0Amount: 1000000000n,
        token1Amount: 2000000000n,
        ratio: 1,
      })

      expect(shape).toMatchSnapshot()
    })
  })
})
