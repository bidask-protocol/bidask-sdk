import { beginCell, Dictionary } from '@ton/ton'

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


export const createLiquidityProvideDict = (bins: LiquidityProvideBins) => {
  return createPaddedBinDict({
    bins,
    emptyBin: [0n, 0n],
    result: Dictionary.empty(Dictionary.Keys.Int(32), Dictionary.Values.Buffer(120)),
    iterator: (paddedBinDict, result, binDictIndex) => {
      const liquidityCell = beginCell()

      for (const [, [amount0, amount1]] of paddedBinDict) {
        liquidityCell.storeUint(amount0, 120).storeUint(amount1, 120)
      }

      return result.set(binDictIndex, liquidityCell.asSlice().loadBuffer(120))
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
