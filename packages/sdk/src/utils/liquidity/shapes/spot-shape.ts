import { CreateShapeParams, LiquidityProvideBins } from '../../../types/liquidity'
import { toBigInt } from '../../bigint'
import { getBinByPrice } from '../../bins'
import { calculateCentralBinLiquidity } from './central-bin'
import { normalizeBinsAmounts } from './normalizer'

export const createSpotShape = (params: CreateShapeParams): LiquidityProvideBins => {
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
    left: countClosedInterval(fromBin, currentNearestBin.left),
    right: countClosedInterval(currentNearestBin.right, toBin),
  }

  const currentBinLiquidity = isTwoSided
    ? calculateCentralBinLiquidity({
        token0Amount: token0AmountNumber,
        token1Amount: token1AmountNumber,
        currentPrice,
        bps,
        ratio,
        unitsOnSide,
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
        const x = i > activeBin ? perUnit.x : 0
        const y = i < activeBin ? perUnit.y : 0

        result[i] = [toBigInt(x), toBigInt(y)]
      } else {
        const [x, y] = currentBinLiquidity
        result[i] = [toBigInt(x), toBigInt(y)]
      }
    }
  } else {
    for (let i = fromBin; i <= toBin; i++) {
      const x = i > activeBin ? perUnit.x : 0
      const y = i < activeBin ? perUnit.y : 0

      result[i] = [toBigInt(x), toBigInt(y)]
    }
  }

  return normalizeBinsAmounts(result, token0Amount, token1Amount)
}

const countClosedInterval = (a: number, b: number) => {
  return Math.abs(b - a) + 1
}
