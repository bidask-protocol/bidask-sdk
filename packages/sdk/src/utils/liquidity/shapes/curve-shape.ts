import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { toBigInt } from '../../bigint'
import { getBinByPrice, getBinPriceBounds } from '../../bins'
import {
  calculateLiquidity,
  calculateLiquidityForTokenX,
  calculateLiquidityForTokenY,
  calculateTokenX,
  calculateTokenY,
} from './central-bin'
import { normalizeBinsAmounts } from './normalizer'

export const createCurveShape = (params: CreateShapeParams): LiquidityProvideBins => {
  const { token0Amount, token1Amount, currentPrice, fromBin, toBin, bps, ratio = 0.8 } = params

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
    ? calculateCurveCurrentBin({
        tokenAmountX: token0AmountNumber,
        tokenAmountY: token1AmountNumber,
        currentPrice,
        unitsOnSide,
        bps,
        fromBin,
        toBin,
        ratio,
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

function calculateCurveCurrentBin(params: {
  tokenAmountX: number
  tokenAmountY: number
  currentPrice: number
  fromBin: number
  toBin: number
  unitsOnSide: { left: number; right: number }
  bps: bigint
  ratio: number
}): [number, number] {
  const { tokenAmountX, tokenAmountY, currentPrice, fromBin, toBin, unitsOnSide, bps, ratio } = params

  const activeSqrtPrice = Math.sqrt(currentPrice)
  const activeBin = getBinByPrice(currentPrice, bps)
  const [lowerBound, upperBound] = getBinPriceBounds(activeBin, bps)
  const sqrtLowerBound = Math.sqrt(lowerBound)
  const sqrtUpperBound = Math.sqrt(upperBound)

  // Calculate single unit liquidity and its share in tokens X and Y
  const singleLiquidity = calculateLiquidity(1, 1, activeSqrtPrice, sqrtLowerBound, sqrtUpperBound)
  const sharePerUnit = {
    x: calculateTokenX(singleLiquidity, activeSqrtPrice, sqrtUpperBound),
    y: calculateTokenY(singleLiquidity, sqrtLowerBound, activeSqrtPrice),
  }

  const perUnitDistribution = {
    x: tokenAmountX / (unitsOnSide.right + sharePerUnit.x),
    y: tokenAmountY / (unitsOnSide.left + sharePerUnit.y),
  }

  const currentBinPotential = {
    x: perUnitDistribution.x * sharePerUnit.x * countClosedInterval(activeBin, toBin),
    y: perUnitDistribution.y * sharePerUnit.y * countClosedInterval(fromBin, activeBin),
  }

  const liquidityX = calculateLiquidityForTokenX(
    currentBinPotential.x,
    sqrtLowerBound,
    sqrtUpperBound,
  )
  const liquidityY = calculateLiquidityForTokenY(
    currentBinPotential.y,
    sqrtLowerBound,
    sqrtUpperBound,
  )

  const currentBinLiquidity =
    liquidityY > liquidityX
      ? calculateLiquidity(
          tokenAmountX * ratio + currentBinPotential.x * (1 - ratio),
          currentBinPotential.y * ratio + tokenAmountY * (1 - ratio),
          activeSqrtPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )
      : calculateLiquidity(
          tokenAmountX * (1 - ratio) + currentBinPotential.x * ratio,
          currentBinPotential.y * (1 - ratio) + tokenAmountY * ratio,
          activeSqrtPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )

  return [
    calculateTokenX(currentBinLiquidity, activeSqrtPrice, sqrtUpperBound),
    calculateTokenY(currentBinLiquidity, sqrtLowerBound, activeSqrtPrice),
  ]
}
