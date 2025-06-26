import Big from 'bignumber.js'

import { getBinByPrice, getBinPriceBounds } from '../../bins'

export const getCentralBinShares = (currentPrice: number, bps: bigint): { x: Big; y: Big } => {
  const currentBin = getBinByPrice(currentPrice, bps)
  const [lowerBound, upperBound] = getBinPriceBounds(currentBin, bps)

  const sqrtLowerBound = Big(lowerBound).sqrt()
  const sqrtUpperBound = Big(upperBound).sqrt()
  const sqrtCurrentPrice = Big(currentPrice).sqrt()

  const singleL = calculateLiquidity(
    Big(1),
    Big(1),
    sqrtCurrentPrice,
    sqrtLowerBound,
    sqrtUpperBound,
  )

  const xShare = calculateTokenX(singleL, sqrtCurrentPrice, sqrtUpperBound)
  const yShare = calculateTokenY(singleL, sqrtLowerBound, sqrtCurrentPrice)

  return {
    x: xShare,
    y: yShare,
  }
}

export const calculateCentralBinLiquidity = (params: {
  token0Amount?: Big
  token1Amount?: Big
  autocomplete?: 'x' | 'y'
  currentPrice: number
  bps: bigint
  fallbackRatio: number
  unitsOnSide: {
    left: number
    right: number
  }
  currentBinPotential: {
    x: Big
    y: Big
  }
}) => {
  const {
    token0Amount,
    token1Amount,
    currentPrice,
    bps,
    unitsOnSide,
    fallbackRatio,
    currentBinPotential,
  } = params

  const activeBin = getBinByPrice(currentPrice, bps)

  const [lowerBound, upperBound] = getBinPriceBounds(activeBin, bps)
  const sqrtLowerBound = Big(lowerBound).sqrt()
  const sqrtUpperBound = Big(upperBound).sqrt()
  const sqrtCurrentPrice = Big(currentPrice).sqrt()

  const liquidityForTokenY = calculateLiquidityForTokenY(
    currentBinPotential.y,
    sqrtLowerBound,
    sqrtCurrentPrice,
  )

  const liquidityForTokenX = calculateLiquidityForTokenX(
    currentBinPotential.x,
    sqrtCurrentPrice,
    sqrtUpperBound,
  )

  let defaultCurrentBinL: Big

  if (token0Amount !== undefined && token1Amount !== undefined) {
    // no autocomplete
    defaultCurrentBinL = liquidityForTokenY.gt(liquidityForTokenX)
      ? calculateLiquidity(
          token0Amount,
          currentBinPotential.y,
          sqrtCurrentPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )
      : calculateLiquidity(
          currentBinPotential.x,
          token1Amount,
          sqrtCurrentPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )
  } else if (token0Amount !== undefined) {
    // autocompleting y
    defaultCurrentBinL = calculateLiquidityForTokenX(
      currentBinPotential.x,
      sqrtLowerBound,
      sqrtCurrentPrice,
    )
  } else {
    // autocompleting x
    defaultCurrentBinL = calculateLiquidityForTokenY(
      currentBinPotential.y,
      sqrtCurrentPrice,
      sqrtUpperBound,
    )
  }

  const defaultTokenYLiquidity = calculateTokenY(
    defaultCurrentBinL,
    sqrtLowerBound,
    sqrtCurrentPrice,
  )

  const defaultTokenXLiquidity = calculateTokenX(
    defaultCurrentBinL,
    sqrtCurrentPrice,
    sqrtUpperBound,
  )

  const isFallbackNeeded =
    token0Amount !== undefined &&
    token1Amount !== undefined &&
    ((unitsOnSide.left !== 0 && defaultTokenYLiquidity.gte(token1Amount)) ||
      (unitsOnSide.right !== 0 && defaultTokenXLiquidity.gte(token0Amount)))

  if (isFallbackNeeded) {
    if (fallbackRatio < 0 || fallbackRatio > 1) {
      throw new Error('Fallback ratio must be between 0 and 1')
    }

    const liquidityForTokenY = calculateLiquidityForTokenY(
      currentBinPotential.y,
      sqrtLowerBound,
      sqrtCurrentPrice,
    )

    const liquidityForTokenX = calculateLiquidityForTokenX(
      currentBinPotential.x,
      sqrtCurrentPrice,
      sqrtUpperBound,
    )

    const fallbackCurrentBinL = liquidityForTokenY.gt(liquidityForTokenX)
      ? calculateLiquidity(
          token0Amount
            .multipliedBy(fallbackRatio)
            .plus(currentBinPotential.x.multipliedBy(1 - fallbackRatio)),
          currentBinPotential.y
            .multipliedBy(fallbackRatio)
            .plus(token1Amount.multipliedBy(1 - fallbackRatio)),
          sqrtCurrentPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )
      : calculateLiquidity(
          token0Amount
            .multipliedBy(1 - fallbackRatio)
            .plus(currentBinPotential.x.multipliedBy(fallbackRatio)),
          currentBinPotential.y
            .multipliedBy(1 - fallbackRatio)
            .plus(token1Amount.multipliedBy(fallbackRatio)),
          sqrtCurrentPrice,
          sqrtLowerBound,
          sqrtUpperBound,
        )

    return [
      calculateTokenX(fallbackCurrentBinL, sqrtCurrentPrice, sqrtUpperBound),
      calculateTokenY(fallbackCurrentBinL, sqrtLowerBound, sqrtCurrentPrice),
    ]
  }

  return [defaultTokenXLiquidity, defaultTokenYLiquidity]
}

/**
 * Calculates the amount of token X based on liquidity and price bounds.
 * @param liquidity - The amount of virtual tokens assuming the price is 1.
 * @param sqrtPrice - The square root of the current price.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Amount of token X.
 */
export function calculateTokenX(liquidity: Big, sqrtPrice: Big, sqrtPriceUpper: Big): Big {
  return liquidity
    .multipliedBy(sqrtPriceUpper.minus(sqrtPrice))
    .div(sqrtPrice.multipliedBy(sqrtPriceUpper))
}

/**
 * Calculates the amount of token Y based on liquidity and price bounds.
 * @param liquidity - The amount of virtual tokens assuming the price is 1.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPrice - The square root of the current price.
 * @returns Amount of token Y.
 */
export function calculateTokenY(liquidity: Big, sqrtPriceLower: Big, sqrtPrice: Big): Big {
  return liquidity.multipliedBy(sqrtPrice.minus(sqrtPriceLower))
}

/**
 * Calculates the liquidity required for a given amount of token X.
 * @param tokenX - Amount of token X.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Liquidity required for token X.
 */
export function calculateLiquidityForTokenX(
  tokenX: Big,
  sqrtPriceLower: Big,
  sqrtPriceUpper: Big,
): Big {
  const priceDiff = sqrtPriceUpper.minus(sqrtPriceLower)

  if (priceDiff.eq(0)) {
    return Big(0)
  }

  return tokenX
    .multipliedBy(sqrtPriceLower)
    .multipliedBy(sqrtPriceUpper)
    .div(sqrtPriceUpper.minus(sqrtPriceLower))
}

/**
 * Calculates the liquidity required for a given amount of token Y.
 * @param tokenY - Amount of token Y.
 * @param sqrtPriceLower - The square root of the lower price bound.
 * @param sqrtPriceUpper - The square root of the upper price bound.
 * @returns Liquidity required for token Y.
 */
export function calculateLiquidityForTokenY(
  tokenY: Big,
  sqrtPriceLower: Big,
  sqrtPriceUpper: Big,
): Big {
  const priceDiff = sqrtPriceUpper.minus(sqrtPriceLower)

  if (priceDiff.eq(0)) {
    return Big(0)
  }

  return tokenY.div(priceDiff)
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
  tokenX: Big,
  tokenY: Big,
  sqrtPrice: Big,
  sqrtPriceLower: Big,
  sqrtPriceUpper: Big,
): Big {
  if (sqrtPrice.lte(sqrtPriceLower)) {
    return calculateLiquidityForTokenX(tokenX, sqrtPriceLower, sqrtPriceUpper)
  }

  if (sqrtPrice.lt(sqrtPriceUpper)) {
    return Big.min(
      calculateLiquidityForTokenX(tokenX, sqrtPrice, sqrtPriceUpper),
      calculateLiquidityForTokenY(tokenY, sqrtPriceLower, sqrtPrice),
    )
  }

  return calculateLiquidityForTokenY(tokenY, sqrtPriceLower, sqrtPriceUpper)
}
