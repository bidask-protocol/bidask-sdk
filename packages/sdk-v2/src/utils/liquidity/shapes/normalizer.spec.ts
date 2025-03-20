import { describe, expect, it } from 'vitest'

import { LiquidityProvideBins } from '../../../types/liquidity'
import { normalizeBinsAmounts } from './normalizer'

describe('normalizeBinsAmounts', () => {
  describe('token1', () => {
    describe('remove excess', () => {
      it('from the leftmost bin', () => {
        const bins: LiquidityProvideBins = {
          '-2': [0n, 102n],
          '-1': [0n, 101n],
          0: [1000n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 3000n, 300n)

        expect(normalizedBins).toEqual({
          '-2': [0n, 99n],
          '-1': [0n, 101n],
          0: [1000n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        })
      })

      it('from central bin', () => {
        const bins: LiquidityProvideBins = {
          0: [1000n, 101n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 3000n, 100n)

        expect(normalizedBins).toEqual({
          0: [1000n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        })
      })
    })

    describe('add missing', () => {
      it('add missing to the rightmost bin', () => {
        const bins: LiquidityProvideBins = {
          '-2': [0n, 95n],
          '-1': [0n, 95n],
          0: [1000n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 3000n, 300n)

        expect(normalizedBins).toEqual({
          '-2': [0n, 95n],
          '-1': [0n, 95n],
          0: [1000n, 110n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        })
      })

      it('to the central bin', () => {
        const bins: LiquidityProvideBins = {
          0: [1000n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 3000n, 300n)

        expect(normalizedBins).toEqual({
          0: [1000n, 300n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        })
      })
    })
  })

  describe('token0', () => {
    describe('remove excess', () => {
      it('from the rightmost bin', () => {
        const bins: LiquidityProvideBins = {
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [1000n, 100n],
          1: [1001n, 0n],
          2: [1002n, 0n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 3000n, 300n)

        expect(normalizedBins).toEqual({
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [1000n, 100n],
          1: [1001n, 0n],
          2: [999n, 0n],
        })
      })

      it('from central bin', () => {
        const bins: LiquidityProvideBins = {
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [1001n, 100n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 1000n, 300n)

        expect(normalizedBins).toEqual({
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [1000n, 100n],
        })
      })
    })

    describe('add missing', () => {
      it('add missing to the leftmost bin', () => {
        const bins: LiquidityProvideBins = {
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [900n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 3000n, 300n)

        expect(normalizedBins).toEqual({
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [1000n, 100n],
          1: [1000n, 0n],
          2: [1000n, 0n],
        })
      })

      it('to the central bin', () => {
        const bins: LiquidityProvideBins = {
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [900n, 100n],
        }

        const normalizedBins = normalizeBinsAmounts(bins, 1000n, 300n)

        expect(normalizedBins).toEqual({
          '-2': [0n, 100n],
          '-1': [0n, 100n],
          0: [1000n, 100n],
        })
      })
    })
  })
})
