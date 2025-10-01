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
  const tokensRelation = Number(tokenYAmount) / Number(tokenXAmount)
  const relation = tokensRelation / price

  if (relation === 1) {
    return { virtualXAmount: 0n, virtualYAmount: 0n }
  }

  if (relation < 1) {
    // Y < X * price, so we need virtual Y
    // y_v = X * price - Y
    const virtualYAmount = toBigInt(
      BigNumber(tokenXAmount).multipliedBy(price).minus(tokenYAmount).toString(),
    )
    return { virtualXAmount: 0n, virtualYAmount }
  }

  // Y > X * price, so we need virtual X
  // x_v = Y / price - X
  const virtualXAmount = toBigInt(
    BigNumber(tokenYAmount).dividedBy(price).minus(tokenXAmount).toString(),
  )
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
  if (priceLower < 0 || priceUpper <= 0) {
    throw new Error('Price bounds must be positive')
  }

  if (priceLower > currentPrice) {
    throw new Error('priceLower must be <= currentPrice')
  }

  if (currentPrice >= priceUpper) {
    throw new Error('currentPrice must be < priceUpper')
  }

  // x_v = X / (√(p_b/p) - 1)
  const virtualXAmount = toBigInt(
    BigNumber(tokenXAmount)
      .dividedBy(BigNumber(priceUpper).dividedBy(currentPrice).sqrt().minus(1))
      .toString(),
  )

  // y_v = √(p_a * p_b) * x_v
  const virtualYAmount = toBigInt(
    BigNumber(priceLower).multipliedBy(priceUpper).sqrt().multipliedBy(virtualXAmount).toString(),
  )

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
  if (priceLower < 0 || priceUpper <= 0) {
    throw new Error('Price bounds must be positive')
  }

  if (priceLower >= currentPrice) {
    throw new Error('priceLower must be < currentPrice')
  }

  if (currentPrice > priceUpper) {
    throw new Error('currentPrice must be <= priceUpper')
  }

  // x_v = Y / (√(p*p_b) - √(p_a*p_b))
  const virtualXAmount = toBigInt(
    BigNumber(tokenYAmount)
      .dividedBy(
        BigNumber(currentPrice)
          .multipliedBy(priceUpper)
          .sqrt()
          .minus(BigNumber(priceLower).multipliedBy(priceUpper).sqrt()),
      )
      .toString(),
  )

  // y_v = √(p_a * p_b) * x_v
  const virtualYAmount = toBigInt(
    BigNumber(priceLower).multipliedBy(priceUpper).sqrt().multipliedBy(virtualXAmount).toString(),
  )

  // X = x_v(√(p_b/p) - 1)
  const tokenXAmount = toBigInt(
    BigNumber(virtualXAmount)
      .multipliedBy(BigNumber(priceUpper).dividedBy(currentPrice).sqrt().minus(1))
      .toString(),
  )

  return { virtualXAmount, virtualYAmount, tokenXAmount }
}
