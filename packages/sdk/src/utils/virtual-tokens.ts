import BigNumber from 'bignumber.js'

import { toBigInt } from './bigint'

/**
 * Calculates virtual token amounts based on desired price and actual token amounts.
 * Formula from: "Фиксируем X, Y и цену (надо найти x_v, y_v)"
 *
 * @param price - Desired price (p = Y/X)
 * @param tokenXAmount - Actual amount of token X
 * @param tokenYAmount - Actual amount of token Y
 * @returns Object with virtualXAmount and virtualYAmount
 */
export function calculateVirtualTokens(
  price: number,
  tokenXAmount: bigint,
  tokenYAmount: bigint,
): { virtualXAmount: bigint; virtualYAmount: bigint } {
  // Use BigNumber comparison to maintain precision for large values
  const bnTokenX = BigNumber(tokenXAmount)
  const bnTokenY = BigNumber(tokenYAmount)
  const targetY = bnTokenX.multipliedBy(price)

  // Check if Y equals X * price
  if (bnTokenY.isEqualTo(targetY)) {
    return { virtualXAmount: 0n, virtualYAmount: 0n }
  }

  if (bnTokenY.isLessThan(targetY)) {
    // Y < X * price, so we need virtual Y
    // y_v = X * price - Y
    const virtualYAmount = toBigInt(targetY.minus(bnTokenY).toString())
    return { virtualXAmount: 0n, virtualYAmount }
  }

  // Y > X * price, so we need virtual X
  // x_v = Y / price - X
  const virtualXAmount = toBigInt(bnTokenY.dividedBy(price).minus(bnTokenX).toString())
  return { virtualXAmount, virtualYAmount: 0n }
}

/**
 * Calculates virtual token amounts and auto-completes tokenY based on price bounds and tokenX.
 * Formula from: "Фиксируем границы, цену, X (надо найти x_v, y_v и автокомплитнуть Y)"
 *
 * @param priceLower - Lower price bound (p_a)
 * @param priceUpper - Upper price bound (p_b)
 * @param currentPrice - Current price (p)
 * @param tokenXAmount - Amount of token X
 * @returns Object with virtualXAmount, virtualYAmount, and tokenYAmount
 */
export function calculateVirtualTokensWithBoundsFromX(
  priceLower: number,
  priceUpper: number,
  currentPrice: number,
  tokenXAmount: bigint,
): { virtualXAmount: bigint; virtualYAmount: bigint; tokenYAmount: bigint } {
  // Validation: allow priceLower >= 0 and priceUpper > 0 or Infinity
  if (priceLower < 0) {
    throw new Error('priceLower must be >= 0')
  }

  if (priceUpper <= 0 && priceUpper !== Infinity) {
    throw new Error('priceUpper must be > 0 or Infinity')
  }

  if (priceLower > 0 && priceLower > currentPrice) {
    throw new Error('priceLower must be <= currentPrice')
  }

  if (priceUpper !== Infinity && currentPrice >= priceUpper) {
    throw new Error('currentPrice must be < priceUpper')
  }

  // Edge case: fully unbounded pool (no bounds at all)
  if (priceLower === 0 && priceUpper === Infinity) {
    return {
      virtualXAmount: 0n,
      virtualYAmount: 0n,
      tokenYAmount: toBigInt(BigNumber(currentPrice).multipliedBy(tokenXAmount).toString()),
    }
  }

  // Edge case: only lower bound exists (no upper bound)
  // y_v = X * sqrt(p * p_a), y = pX - y_v
  if (priceUpper === Infinity) {
    const virtualYAmount = toBigInt(
      BigNumber(currentPrice).multipliedBy(priceLower).sqrt().multipliedBy(tokenXAmount).toString(),
    )
    const tokenYAmount = toBigInt(
      BigNumber(currentPrice).multipliedBy(tokenXAmount).minus(virtualYAmount).toString(),
    )
    return { virtualXAmount: 0n, virtualYAmount, tokenYAmount }
  }

  // Edge case: only upper bound exists (no lower bound)
  // x_v = Y / sqrt(p * p_b), but we need to derive from X
  if (priceLower === 0) {
    const virtualXAmount = toBigInt(
      BigNumber(currentPrice)
        .multipliedBy(tokenXAmount)
        .dividedBy(priceUpper - currentPrice)
        .toString(),
    )
    const tokenYAmount = toBigInt(
      BigNumber(currentPrice).multipliedBy(BigNumber(tokenXAmount).plus(virtualXAmount)).toString(),
    )
    return { virtualXAmount, virtualYAmount: 0n, tokenYAmount }
  }

  // Cache common subexpressions for clarity and performance
  const sqrtPriceUpperOverCurrent = BigNumber(priceUpper).dividedBy(currentPrice).sqrt()
  const sqrtPriceLowerUpper = BigNumber(priceLower).multipliedBy(priceUpper).sqrt()

  // x_v = X / (√(p_b/p) - 1)
  const virtualXAmount = toBigInt(
    BigNumber(tokenXAmount).dividedBy(sqrtPriceUpperOverCurrent.minus(1)).toString(),
  )

  // y_v = √(p_a * p_b) * x_v
  const virtualYAmount = toBigInt(sqrtPriceLowerUpper.multipliedBy(virtualXAmount).toString())

  // Y = p(X + x_v) - y_v
  const tokenYAmount = toBigInt(
    BigNumber(currentPrice)
      .multipliedBy(BigNumber(tokenXAmount).plus(virtualXAmount))
      .minus(virtualYAmount)
      .toString(),
  )

  return { virtualXAmount, virtualYAmount, tokenYAmount }
}

/**
 * Calculates virtual token amounts and auto-completes tokenX based on price bounds and tokenY.
 * Formula from: "Фиксируем границы, цену, Y (надо найти x_v, y_v и автокомплитнуть X)"
 *
 * @param priceLower - Lower price bound (p_a)
 * @param priceUpper - Upper price bound (p_b)
 * @param currentPrice - Current price (p)
 * @param tokenYAmount - Amount of token Y
 * @returns Object with virtualXAmount, virtualYAmount, and tokenXAmount
 */
export function calculateVirtualTokensWithBoundsFromY(
  priceLower: number,
  priceUpper: number,
  currentPrice: number,
  tokenYAmount: bigint,
): { virtualXAmount: bigint; virtualYAmount: bigint; tokenXAmount: bigint } {
  // Validation: allow priceLower >= 0 and priceUpper > 0 or Infinity
  if (priceLower < 0) {
    throw new Error('priceLower must be >= 0')
  }

  if (priceUpper <= 0 && priceUpper !== Infinity) {
    throw new Error('priceUpper must be > 0 or Infinity')
  }

  if (priceLower > 0 && priceLower >= currentPrice) {
    throw new Error('priceLower must be < currentPrice')
  }

  if (priceUpper !== Infinity && currentPrice > priceUpper) {
    throw new Error('currentPrice must be <= priceUpper')
  }

  // Edge case: fully unbounded pool (no bounds at all)
  if (priceLower === 0 && priceUpper === Infinity) {
    return {
      virtualXAmount: 0n,
      virtualYAmount: 0n,
      tokenXAmount: toBigInt(BigNumber(tokenYAmount).dividedBy(currentPrice).toString()),
    }
  }

  // Edge case: only lower bound exists (no upper bound)
  // y_v = X * sqrt(p * p_a), y = pX - y_v
  // Solving for X: X = Y / (p - sqrt(p * p_a))
  if (priceUpper === Infinity) {
    const sqrtPriceLowerCurrent = BigNumber(priceLower).multipliedBy(currentPrice).sqrt()
    const tokenXAmount = toBigInt(
      BigNumber(tokenYAmount)
        .dividedBy(BigNumber(currentPrice).minus(sqrtPriceLowerCurrent))
        .toString(),
    )
    const virtualYAmount = toBigInt(sqrtPriceLowerCurrent.multipliedBy(tokenXAmount).toString())

    return { virtualXAmount: 0n, virtualYAmount, tokenXAmount }
  }

  // Edge case: only upper bound exists (no lower bound)
  // x_v = Y / sqrt(p * p_b), x = Y/p - x_v
  if (priceLower === 0) {
    const virtualXAmount = toBigInt(
      BigNumber(tokenYAmount)
        .dividedBy(BigNumber(currentPrice).multipliedBy(priceUpper).sqrt())
        .toString(),
    )
    const tokenXAmount = toBigInt(
      BigNumber(tokenYAmount).dividedBy(currentPrice).minus(virtualXAmount).toString(),
    )
    return { virtualXAmount, virtualYAmount: 0n, tokenXAmount }
  }

  // Cache common subexpressions to avoid redundant calculations
  const sqrtPriceLowerUpper = BigNumber(priceLower).multipliedBy(priceUpper).sqrt()
  const sqrtCurrentPriceUpper = BigNumber(currentPrice).multipliedBy(priceUpper).sqrt()

  // x_v = Y / (√(p*p_b) - √(p_a*p_b))
  const virtualXAmount = toBigInt(
    BigNumber(tokenYAmount).dividedBy(sqrtCurrentPriceUpper.minus(sqrtPriceLowerUpper)).toString(),
  )

  // y_v = √(p_a * p_b) * x_v
  const virtualYAmount = toBigInt(sqrtPriceLowerUpper.multipliedBy(virtualXAmount).toString())

  // X = x_v(√(p_b/p) - 1)
  const tokenXAmount = toBigInt(
    BigNumber(virtualXAmount)
      .multipliedBy(BigNumber(priceUpper).dividedBy(currentPrice).sqrt().minus(1))
      .toString(),
  )

  return { virtualXAmount, virtualYAmount, tokenXAmount }
}

/**
 * Calculates the amount of tokenX to add (autofill) when adding a specified amount of tokenY.
 * When providing liquidity, virtual tokens scale proportionally with real tokens.
 * The ratio must be: deltaX / X = deltaY / Y
 * Formula: deltaX = deltaY * X / Y
 *
 * @param tokenXAmount - Current amount of token X
 * @param tokenYAmount - Current amount of token Y
 * @param tokenYToAdd - Amount of token Y to add
 * @returns Amount of token X to add to maintain proportional liquidity
 */
export function calculateTokenXToAddByTokenY(
  tokenXAmount: bigint,
  tokenYAmount: bigint,
  tokenYToAdd: bigint,
): bigint {
  if (tokenYAmount === 0n) {
    throw new Error('Cannot calculate: Y = 0')
  }

  // deltaX = deltaY * X / Y
  const tokenXToAdd = toBigInt(
    BigNumber(tokenYToAdd).multipliedBy(tokenXAmount).dividedBy(tokenYAmount).toString(),
  )

  return tokenXToAdd
}

/**
 * Calculates the amount of tokenY to add (autofill) when adding a specified amount of tokenX.
 * When providing liquidity, virtual tokens scale proportionally with real tokens.
 * The ratio must be: deltaX / X = deltaY / Y
 * Formula: deltaY = deltaX * Y / X
 *
 * @param tokenXAmount - Current amount of token X
 * @param tokenYAmount - Current amount of token Y
 * @param tokenXToAdd - Amount of token X to add
 * @returns Amount of token Y to add to maintain proportional liquidity
 */
export function calculateTokenYToAddByTokenX(
  tokenXAmount: bigint,
  tokenYAmount: bigint,
  tokenXToAdd: bigint,
): bigint {
  if (tokenXAmount === 0n) {
    throw new Error('Cannot calculate: X = 0')
  }

  // deltaY = deltaX * Y / X
  const tokenYToAdd = toBigInt(
    BigNumber(tokenXToAdd).multipliedBy(tokenYAmount).dividedBy(tokenXAmount).toString(),
  )

  return tokenYToAdd
}

/**
 * Calculates the minimum price (lower bound p_a) from token amounts and virtual tokens.
 * Formula: p_a = y_v / (X + x_v)
 * At minimum price, all Y is depleted (Y = 0).
 *
 * @param tokenXAmount - Amount of token X
 * @param virtualXAmount - Virtual amount of token X
 * @param virtualYAmount - Virtual amount of token Y
 * @returns Minimum price, or null if no price bounds exist (both virtual amounts are 0)
 */
export function calculateMinPrice(
  tokenXAmount: bigint,
  virtualXAmount: bigint,
  virtualYAmount: bigint,
): number | null {
  if (virtualXAmount === 0n && virtualYAmount === 0n) {
    return null
  }

  const denominator = BigNumber(tokenXAmount).plus(virtualXAmount)

  if (denominator.isZero()) {
    throw new Error('Cannot calculate min price: X + x_v = 0')
  }

  const minPrice = BigNumber(virtualYAmount).dividedBy(denominator).toNumber()
  return minPrice
}

/**
 * Calculates the maximum price (upper bound p_b) from token amounts and virtual tokens.
 * Formula: p_b = (Y + y_v) / x_v
 * At maximum price, all X is depleted (X = 0).
 *
 * @param tokenYAmount - Amount of token Y
 * @param virtualXAmount - Virtual amount of token X
 * @param virtualYAmount - Virtual amount of token Y
 * @returns Maximum price, or null if no price bounds exist (both virtual amounts are 0)
 */
export function calculateMaxPrice(
  tokenYAmount: bigint,
  virtualXAmount: bigint,
  virtualYAmount: bigint,
): number | null {
  if (virtualXAmount === 0n && virtualYAmount === 0n) {
    return null
  }

  if (virtualXAmount === 0n) {
    throw new Error('Cannot calculate max price: x_v = 0')
  }

  const maxPrice = BigNumber(tokenYAmount).plus(virtualYAmount).dividedBy(virtualXAmount).toNumber()
  return maxPrice
}
