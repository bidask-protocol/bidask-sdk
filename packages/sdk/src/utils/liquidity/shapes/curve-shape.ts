import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { getBinByPrice } from '../../bins'
import { getNearestBinUnits, shapeCreator } from './shape-creator'

/**
 * Creates bin dictionary for curve shape
 *
 * @returns The curve shape
 */
export const createCurveShape = (params: CreateShapeParams): LiquidityProvideBins => {
  const activeBin = getBinByPrice(params.currentPrice, params.bps)

  const nearestBinUnits = getNearestBinUnits(params.fromBin, activeBin, params.toBin)

  return shapeCreator({
    ...params,
    xBinCreator: (perUnit, bin) =>
      perUnit.multipliedBy(curveBinHeight(bin, params.toBin, activeBin)),
    yBinCreator: (perUnit, bin) =>
      perUnit.multipliedBy(curveBinHeight(bin, params.fromBin, activeBin)),
    centralBinUnits: {
      left: countClosedInterval(params.fromBin, activeBin),
      right: countClosedInterval(activeBin, params.toBin),
    },
    sideBinsUnits: {
      left: curveSum(params.fromBin, nearestBinUnits.left, activeBin),
      right: curveSum(nearestBinUnits.right, params.toBin, activeBin),
    },
  })
}

const countClosedInterval = (a: number, b: number) => {
  return Math.abs(b - a) + 1
}

function arithmeticProgressionSum(a: number, b: number) {
  return ((a + b) * countClosedInterval(a, b)) / 2
}

function curveBinHeight(bin: number, farestBin: number, currentBin: number) {
  return countClosedInterval(farestBin, currentBin) - Math.abs(bin - currentBin)
}

function curveSum(fromBin: number, toBin: number, currentBin: number) {
  const farestBin = Math.abs(fromBin - currentBin) > Math.abs(toBin - currentBin) ? fromBin : toBin

  return arithmeticProgressionSum(
    curveBinHeight(fromBin, farestBin, currentBin),
    curveBinHeight(toBin, farestBin, currentBin),
  )
}
