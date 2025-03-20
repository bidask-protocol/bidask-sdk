import { getBinByPrice, getBinPriceBounds } from '../../bins'

export const getCentralBinShares = (currentPrice: number, bps: bigint) => {
  const currentBin = getBinByPrice(currentPrice, bps)
  const [lowerBound, upperBound] = getBinPriceBounds(currentBin, bps)

  const sqrtLowerBound = Math.sqrt(lowerBound)
  const sqrtUpperBound = Math.sqrt(upperBound)
  const sqrtCurrentPrice = Math.sqrt(currentPrice)

  const singleL = calculateLiquidity(1, 1, sqrtCurrentPrice, sqrtLowerBound, sqrtUpperBound)

  const xShare = calculateTokenX(singleL, sqrtCurrentPrice, sqrtUpperBound)
  const yShare = calculateTokenY(singleL, sqrtLowerBound, sqrtCurrentPrice)

  return {
    x: xShare,
    y: yShare,
  }
}

export const calculateCentralBinLiquidity = (params: {
  token0Amount: number
  token1Amount: number
  currentPrice: number
  bps: bigint
  unitsOnSide: {
    left: number
    right: number
  }
}) => {
  const { token0Amount, token1Amount, currentPrice, bps, unitsOnSide } = params

  const share = getCentralBinShares(currentPrice, bps)

  const perUnit = {
    x: token0Amount / (unitsOnSide.right + share.x),
    y: token1Amount / (unitsOnSide.left + share.y),
  }

  const currentBinPotential = {
    x: perUnit.x * share.x,
    y: perUnit.y * share.y,
  }

  const activeBin = getBinByPrice(currentPrice, bps)

  const [lowerBound, upperBound] = getBinPriceBounds(activeBin, bps)
  const sqrtLowerBound = Math.sqrt(lowerBound)
  const sqrtUpperBound = Math.sqrt(upperBound)
  const sqrtCurrentPrice = Math.sqrt(currentPrice)

  const currentBinL =
    calculateLiquidityForTokenY(currentBinPotential.y, sqrtLowerBound, sqrtUpperBound) >
    calculateLiquidityForTokenX(currentBinPotential.x, sqrtLowerBound, sqrtUpperBound)
      ? calculateLiquidity(
          token0Amount,
          currentBinPotential.y,
          sqrtCurrentPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )
      : calculateLiquidity(
          currentBinPotential.x,
          token0Amount,
          sqrtCurrentPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )

  return [
    calculateTokenX(currentBinL, sqrtCurrentPrice, sqrtUpperBound),
    calculateTokenY(currentBinL, sqrtLowerBound, sqrtCurrentPrice),
  ]
}

/**
 * Calculates the amount of token X based on liquidity and price bounds.
 * @param liquidity - The amount of virtual tokens assuming the price is 1.
 * @param sqrtPrice - The square root of the current price.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Amount of token X.
 */
export function calculateTokenX(
  liquidity: number,
  sqrtPrice: number,
  sqrtPriceUpper: number,
): number {
  return (liquidity * (sqrtPriceUpper - sqrtPrice)) / (sqrtPrice * sqrtPriceUpper)
}

/**
 * Calculates the amount of token Y based on liquidity and price bounds.
 * @param liquidity - The amount of virtual tokens assuming the price is 1.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPrice - The square root of the current price.
 * @returns Amount of token Y.
 */
export function calculateTokenY(
  liquidity: number,
  sqrtPriceLower: number,
  sqrtPrice: number,
): number {
  return liquidity * (sqrtPrice - sqrtPriceLower)
}

/**
 * Calculates the liquidity required for a given amount of token X.
 * @param tokenX - Amount of token X.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Liquidity required for token X.
 */
export function calculateLiquidityForTokenX(
  tokenX: number,
  sqrtPriceLower: number,
  sqrtPriceUpper: number,
): number {
  return (tokenX * sqrtPriceLower * sqrtPriceUpper) / (sqrtPriceUpper - sqrtPriceLower)
}

/**
 * Calculates the liquidity required for a given amount of token Y.
 * @param tokenY - Amount of token Y.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Liquidity required for token Y.
 */
export function calculateLiquidityForTokenY(
  tokenY: number,
  sqrtPriceLower: number,
  sqrtPriceUpper: number,
): number {
  return tokenY / (sqrtPriceUpper - sqrtPriceLower)
}

/**
 * Calculates the liquidity based on token amounts and price bounds.
 * @param tokenX - Amount of token X.
 * @param tokenY - Amount of token Y.
 * @param sqrtPrice - The square root of the current price.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Liquidity value.
 */
export function calculateLiquidity(
  tokenX: number,
  tokenY: number,
  sqrtPrice: number,
  sqrtPriceLower: number,
  sqrtPriceUpper: number,
): number {
  if (sqrtPrice <= sqrtPriceLower) {
    return calculateLiquidityForTokenX(tokenX, sqrtPriceLower, sqrtPriceUpper)
  }

  if (sqrtPrice < sqrtPriceUpper) {
    return Math.min(
      calculateLiquidityForTokenX(tokenX, sqrtPrice, sqrtPriceUpper),
      calculateLiquidityForTokenY(tokenY, sqrtPriceLower, sqrtPrice),
    )
  }

  return calculateLiquidityForTokenY(tokenY, sqrtPriceLower, sqrtPriceUpper)
}
