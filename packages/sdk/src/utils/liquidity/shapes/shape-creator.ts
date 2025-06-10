import Big from 'bignumber.js'

import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { toBigInt } from '../../bigint'
import { getBinByPrice } from '../../bins'
import { calculateCentralBinLiquidity } from './central-bin'

export const shapeCreator = (
  params: CreateShapeParams & {
    xBinCreator: (perUnit: Big, bin: number) => Big
    yBinCreator: (perUnit: Big, bin: number) => Big
    centralBinUnits: {
      left: number
      right: number
    }
    sideBinsUnits: {
      left: number
      right: number
    }
  },
): LiquidityProvideBins => {
  const {
    token0Amount,
    token1Amount,
    currentPrice,
    fromBin,
    toBin,
    bps,
    fallbackRatio = 0.8,
    xBinCreator,
    yBinCreator,
    centralBinUnits,
    sideBinsUnits,
  } = params

  const activeBin = getBinByPrice(currentPrice, bps)

  const unitsOnSide = {
    left: sideBinsUnits.left,
    right: sideBinsUnits.right,
  }

  const isTwoSided = fromBin <= activeBin && toBin >= activeBin

  const currentBinLiquidity = isTwoSided
    ? calculateCentralBinLiquidity({
        token0Amount: Big(token0Amount),
        token1Amount: Big(token1Amount),
        currentPrice,
        bps,
        fallbackRatio,
        unitsOnSide,
        centralBinUnits,
      })
    : [Big(0), Big(0)]

  const perUnit = {
    x:
      unitsOnSide.right !== 0
        ? Big(token0Amount).minus(currentBinLiquidity[0]).div(unitsOnSide.right)
        : Big(0),
    y:
      unitsOnSide.left !== 0
        ? Big(token1Amount).minus(currentBinLiquidity[1]).div(unitsOnSide.left)
        : Big(0),
  }

  const result: LiquidityProvideBins = {}

  for (let i = fromBin; i <= toBin; i++) {
    if (i < activeBin) {
      const y = Big.max(0, yBinCreator(perUnit.y, i))

      result[i] = [0n, toBigInt(y.toString())]
    } else if (i === activeBin) {
      const [x, y] = currentBinLiquidity
      result[i] = [BigInt(x.toFixed(0)), BigInt(y.toFixed(0))]
    } else {
      const x = Big.max(0, xBinCreator(perUnit.x, i))

      result[i] = [toBigInt(x.toString()), 0n]
    }
  }

  return result
}

export const getNearestBinUnits = (fromBin: number, activeBin: number, toBin: number) => {
  return {
    left: Math.min(toBin, activeBin - 1),
    right: Math.max(activeBin + 1, fromBin),
  }
}
