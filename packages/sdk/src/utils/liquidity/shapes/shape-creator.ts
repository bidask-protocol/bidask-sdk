import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { toBigInt } from '../../bigint'
import { getBinByPrice } from '../../bins'
import { calculateCentralBinLiquidity } from './central-bin'

export const shapeCreator = (
  params: CreateShapeParams & {
    xBinCreator: (perUnit: number, bin: number) => number
    yBinCreator: (perUnit: number, bin: number) => number
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

  const token0AmountNumber = Number(token0Amount)
  const token1AmountNumber = Number(token1Amount)

  const activeBin = getBinByPrice(currentPrice, bps)

  const unitsOnSide = {
    left: sideBinsUnits.left,
    right: sideBinsUnits.right,
  }

  const isTwoSided = fromBin <= activeBin && toBin >= activeBin

  const currentBinLiquidity = isTwoSided
    ? calculateCentralBinLiquidity({
        token0Amount: token0AmountNumber,
        token1Amount: token1AmountNumber,
        currentPrice,
        bps,
        fallbackRatio,
        unitsOnSide,
        centralBinUnits,
      })
    : [0, 0]

  const perUnit = {
    x:
      unitsOnSide.right !== 0
        ? (token0AmountNumber - currentBinLiquidity[0]) / unitsOnSide.right
        : 0,
    y:
      unitsOnSide.left !== 0 ? (token1AmountNumber - currentBinLiquidity[1]) / unitsOnSide.left : 0,
  }

  const result: LiquidityProvideBins = {}

  for (let i = fromBin; i <= toBin; i++) {
    if (i < activeBin) {
      const y = Math.max(0, yBinCreator(perUnit.y, i))

      result[i] = [0n, toBigInt(y)]
    } else if (i === activeBin) {
      const [x, y] = currentBinLiquidity
      result[i] = [toBigInt(x), toBigInt(y)]
    } else {
      const x = Math.max(0, xBinCreator(perUnit.x, i))

      result[i] = [toBigInt(x), 0n]
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
