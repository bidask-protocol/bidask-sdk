import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { getBinByPrice } from '../../bins'
import { getNearestBinUnits, shapeCreator } from './shape-creator'

/**
 * Creates bin dictionary for spot shape
 *
 * @returns The spot shape
 */
export const createSpotShape = (params: CreateShapeParams): LiquidityProvideBins => {
  const activeBin = getBinByPrice(params.currentPrice, params.bps)

  const nearestBinUnits = getNearestBinUnits(params.fromBin, activeBin, params.toBin)

  return shapeCreator({
    ...params,
    xBinCreator: (perUnit) => perUnit,
    yBinCreator: (perUnit) => perUnit,
    centralBinUnits: {
      left: 1,
      right: 1,
    },
    sideBinsUnits: {
      left:
        activeBin === params.fromBin
          ? 0
          : countClosedInterval(params.fromBin, nearestBinUnits.left),
      right:
        activeBin === params.toBin ? 0 : countClosedInterval(nearestBinUnits.right, params.toBin),
    },
  })
}

const countClosedInterval = (a: number, b: number) => {
  return Math.abs(b - a) + 1
}
