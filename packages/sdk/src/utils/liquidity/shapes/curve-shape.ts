import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { toBigInt } from '../../bigint'
import { getBinByPrice } from '../../bins'
import { calculateCentralBinLiquidity } from './central-bin'
import { normalizeBinsAmounts } from './normalizer'

/**
 * Creates bin dictionary for curve shape
 *
 * @returns The curve shape
 */
export const createCurveShape = (params: CreateShapeParams): LiquidityProvideBins => {
  const {
    token0Amount,
    token1Amount,
    currentPrice,
    fromBin,
    toBin,
    bps,
    fallbackRatio = 0.8,
  } = params

  const token0AmountNumber = Number(token0Amount)
  const token1AmountNumber = Number(token1Amount)

  const activeBin = getBinByPrice(currentPrice, bps)

  const currentNearestBin = {
    left: Math.min(toBin, activeBin - 1),
    right: Math.max(activeBin + 1, fromBin),
  }

  const isTwoSided = fromBin <= activeBin && toBin >= activeBin

  const unitsOnSide = {
    left: curveSum(fromBin, currentNearestBin.left, activeBin),
    right: curveSum(currentNearestBin.right, toBin, activeBin),
  }

  const currentBinLiquidity = isTwoSided
    ? calculateCentralBinLiquidity({
        token0Amount: token0AmountNumber,
        token1Amount: token1AmountNumber,
        currentPrice,
        bps,
        fallbackRatio,
        unitsOnSide,
        centralBinUnits: {
          left: countClosedInterval(fromBin, activeBin),
          right: countClosedInterval(activeBin, toBin),
        },
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

  if (isTwoSided) {
    for (let i = fromBin; i <= toBin; i++) {
      if (i !== activeBin) {
        const x = i > activeBin ? curveBinHeight(i, toBin, activeBin) * perUnit.x : 0
        const y = i < activeBin ? curveBinHeight(i, fromBin, activeBin) * perUnit.y : 0

        result[i] = [toBigInt(x), toBigInt(y)]
      } else {
        const [x, y] = currentBinLiquidity
        result[i] = [toBigInt(x), toBigInt(y)]
      }
    }
  } else {
    for (let i = fromBin; i <= toBin; i++) {
      const x = i > activeBin ? curveBinHeight(i, toBin, activeBin) * perUnit.x : 0
      const y = i < activeBin ? curveBinHeight(i, fromBin, activeBin) * perUnit.y : 0

      result[i] = [toBigInt(x), toBigInt(y)]
    }
  }

  return normalizeBinsAmounts(result, token0Amount, token1Amount)
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
