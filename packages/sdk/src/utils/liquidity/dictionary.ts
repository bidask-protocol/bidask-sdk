import { beginCell, BitString, Builder, Dictionary, Slice } from '@ton/ton'

import { BINS_IN_RANGE, MAX_PROVIDED_BINS_IN_MESSAGE, ZERO_RANGE_START } from '../../constants'
import { LiquidityProvideBins, LiquidityRemoveBins } from '../../types/liquidity'

/**
 * Allows you to create bin dictionaries padded with placeholder bins in the start and end of binDictionary
 *
 * @param params - The parameters
 * @param params.bins - The bins
 * @param params.emptyBin - Placeholder for the empty bin
 * @param params.result - The result
 * @param params.iterator - The iterator
 */
export const createPaddedBinDict = <
  BinValue extends any,
  Bins extends Record<number, BinValue>,
  Result,
>(params: {
  bins: Bins
  emptyBin: BinValue
  result: Result
  iterator: (
    paddedBinDict: Array<[number, BinValue]>,
    result: Result,
    binDictIndex: number,
  ) => Result
}) => {
  const sortedBinNumbers = Object.keys(params.bins)
    .map(Number)
    .sort((a, b) => a - b)

  if (sortedBinNumbers.length === 0) return params.result

  const tmpBins: Record<number, Array<[number, BinValue]>> = {}
  for (const bin of sortedBinNumbers) {
    const groupKey = Math.floor(bin / 4)

    if (!tmpBins[groupKey]) {
      const initialGroupBin = groupKey * 4

      tmpBins[groupKey] = [
        [initialGroupBin, params.emptyBin],
        [initialGroupBin + 1, params.emptyBin],
        [initialGroupBin + 2, params.emptyBin],
        [initialGroupBin + 3, params.emptyBin],
      ]
    }

    const positionInGroup = ((bin % 4) + 4) % 4
    tmpBins[groupKey][positionInGroup] = [bin, params.bins[bin]]
  }

  let result = params.result

  for (const groupKey in tmpBins) {
    result = params.iterator(tmpBins[groupKey], result, Number(groupKey))
  }

  return result
}

const BitStringProcessor = {
  serialize: (src: BitString, builder: Builder) => {
    builder.storeBits(src)
  },
  parse: (src: Slice) => {
    return src.loadBits(src.asBuilder().bits)
  },
}

export const createLiquidityProvideDict = (bins: LiquidityProvideBins) => {
  return createPaddedBinDict({
    bins,
    emptyBin: [0n, 0n],
    result: Dictionary.empty(Dictionary.Keys.Int(32), BitStringProcessor),
    iterator: (paddedBinDict, result, binDictIndex) => {
      const liquidityCell = beginCell()

      for (const [, [amount0, amount1]] of paddedBinDict) {
        liquidityCell.storeCoins(amount0).storeCoins(amount1)
      }

      return result.set(binDictIndex, liquidityCell.asSlice().loadBits(liquidityCell.bits))
    },
  })
}

export const createLiquidityBurnDict = (bins: LiquidityRemoveBins) => {
  return createPaddedBinDict({
    bins,
    emptyBin: 0n,
    result: Dictionary.empty(Dictionary.Keys.Int(32), Dictionary.Values.Buffer(122)),
    iterator: (bins, result, binDictIndex) => {
      let liquidityCell = beginCell()

      for (const [, burnAmount] of bins) {
        liquidityCell = liquidityCell.storeUint(burnAmount, 244)
      }

      return result.set(binDictIndex, liquidityCell.asSlice().loadBuffer(122))
    },
  })
}

export const divideBinsIntoBatches = (bins: LiquidityProvideBins) => {
  // Split bins into ranges
  const binsByRange: Record<number, LiquidityProvideBins> = {}
  Object.entries(bins).forEach(([binId, amounts]) => {
    const binNum = Number(binId)
    const rangeNum = Math.floor((binNum - ZERO_RANGE_START) / BINS_IN_RANGE)
    binsByRange[rangeNum] ??= {}
    binsByRange[rangeNum][binNum] = amounts
  })

  // Further split ranges if they exceed MAX_PROVIDED_BINS_IN_MESSAGE
  const finalBinGroups: LiquidityProvideBins[] = []
  Object.values(binsByRange).forEach((rangeBins) => {
    const binIds = Object.keys(rangeBins)
      .map(Number)
      .sort((a, b) => a - b)
    if (binIds.length <= MAX_PROVIDED_BINS_IN_MESSAGE) {
      finalBinGroups.push(rangeBins)
    } else {
      for (let i = 0; i < binIds.length; i += MAX_PROVIDED_BINS_IN_MESSAGE) {
        const chunk: LiquidityProvideBins = {}
        const chunkIds = binIds.slice(i, i + MAX_PROVIDED_BINS_IN_MESSAGE)
        chunkIds.forEach((id) => {
          chunk[id] = rangeBins[id]
        })
        finalBinGroups.push(chunk)
      }
    }
  })

  return finalBinGroups
}
