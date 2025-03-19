import { beginCell, Dictionary } from '@ton/ton'

import { LiquidityProvideBins } from '../../types/liquidity'

export const createPaddedBinDict = <
  BinValue extends any,
  Bins extends Record<number, BinValue>,
  Dict extends Dictionary<any, any>,
>(params: {
  bins: Bins
  emptyBin: BinValue
  dict: Dict
  iterator: (paddedBinDict: Array<[number, BinValue]>, dict: Dict, binDictIndex: number) => Dict
}) => {
  const sortedBinNumbers = Object.keys(params.bins)
    .map(Number)
    .sort((a, b) => a - b)

  if (sortedBinNumbers.length === 0) return params.dict

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

  let result = params.dict

  for (const groupKey in tmpBins) {
    result = params.iterator(tmpBins[groupKey], result, Number(groupKey))
  }

  return result
}

export const createLiquidityProvideDict = (bins: LiquidityProvideBins) => {
  return createPaddedBinDict({
    bins,
    emptyBin: [0n, 0n],
    dict: Dictionary.empty(Dictionary.Keys.Int(32), Dictionary.Values.Buffer(122)),
    iterator: (paddedBinDict, dict, binDictIndex) => {
      const liquidityCell = beginCell()

      for (const [, [amount0, amount1]] of paddedBinDict) {
        liquidityCell.storeUint(amount0, 120).storeUint(amount1, 120)
      }

      return dict.set(binDictIndex, liquidityCell.asSlice().loadBuffer(120))
    },
  })
}
