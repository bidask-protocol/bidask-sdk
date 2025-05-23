import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { getBinByPrice } from '../../bins'
import { getNearestBinUnits, shapeCreator } from './shape-creator'

/**
 * Creates bin dictionary for bidask shape
 *
 * @returns The bidask shape
 */
export const createBidaskShape = (params: CreateShapeParams): LiquidityProvideBins => {
  const activeBin = getBinByPrice(params.currentPrice, params.bps)

  const nearestBinUnits = getNearestBinUnits(params.fromBin, activeBin, params.toBin)

  return shapeCreator({
    ...params,
    xBinCreator: (perUnit, bin) => bidaskBinHeight(bin, activeBin) * perUnit,
    yBinCreator: (perUnit, bin) => bidaskBinHeight(bin, activeBin) * perUnit,
    centralBinUnits: {
      left: 1,
      right: 1,
    },
    sideBinsUnits: {
      left:
        activeBin === params.fromBin
          ? 0
          : bidaskSum(params.fromBin, nearestBinUnits.left, activeBin),
      right:
        activeBin === params.toBin ? 0 : bidaskSum(nearestBinUnits.right, params.toBin, activeBin),
    },
    fallbackRatio: 0.2,
  })
}

const countClosedInterval = (a: number, b: number) => {
  return Math.abs(b - a) + 1
}

function bidaskBinHeight(bin: number, currentBin: number) {
  return countClosedInterval(currentBin, bin)
}

function arithmeticProgressionSum(a: number, b: number) {
  return ((a + b) * countClosedInterval(a, b)) / 2
}

function bidaskSum(fromBin: number, toBin: number, currentBin: number) {
  return arithmeticProgressionSum(
    bidaskBinHeight(fromBin, currentBin),
    bidaskBinHeight(currentBin, toBin),
  )
}
