import Big from 'bignumber.js'

import { toBigInt } from './bigint'

const twoPow128 = Big('340282366920938463463374607431768211456') // 2^128

/**
 * Gets the sqrt price X 128
 * @param price - The price
 * @returns The sqrt price X 128
 */
export const getSqrtPriceX128 = (price: number): bigint => {
  const sqrt = Big(price).sqrt()
  return toBigInt(sqrt.multipliedBy(twoPow128).toPrecision(100))
}

/**
 * Gets the price from sqrt price X 128
 * @param sqrtPriceX128 - The sqrt price X 128
 * @returns The price
 */
export const getPriceFromSqrtPriceX128 = (sqrtPriceX128: bigint): number => {
  const sqrt = Big(sqrtPriceX128).div(twoPow128).pow(2)
  return sqrt.toNumber()
}

/**
 * Converts a blockchain price to its human-readable representation accounting for decimal differences
 *
 * @param rawPrice Price in blockchain format
 * @param jetton0Decimals Number of decimal places for the first token
 * @param jetton1Decimals Number of decimal places for the second token
 * @returns Price adjusted for human readability with proper decimal scaling
 */
export const getReadablePrice = (
  rawPrice: number,
  jetton0Decimals: number,
  jetton1Decimals: number,
) => {
  return rawPrice * 10 ** (jetton0Decimals - jetton1Decimals)
}

/**
 * Converts a human-readable price to its blockchain representation accounting for decimal differences
 *
 * @param humanReadablePrice Price in human-readable format (as if tokens had same decimal places)
 * @param jetton0Decimals Number of decimal places for the first token
 * @param jetton1Decimals Number of decimal places for the second token
 * @returns Price adjusted for the blockchain with proper decimal scaling
 */
export const getRawPrice = (
  humanReadablePrice: number,
  jetton0Decimals: number,
  jetton1Decimals: number,
) => {
  return humanReadablePrice / 10 ** (jetton0Decimals - jetton1Decimals)
}
