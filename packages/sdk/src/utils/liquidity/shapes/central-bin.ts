import { getBinByPrice } from '../../bins'
import { createSpotShape } from './spot-shape'

/**
 * Calculates the amount of token X needed for a central bin position given an amount of token Y
 * @param tokenYAmount - The amount of token Y to provide
 * @param currentPrice - The current price of the token pair
 * @param bps - The basis points for bin spacing
 * @returns The calculated amount of token X required
 */
export const calculateCentralAmountXByAmountY = (
  tokenYAmount: bigint,
  currentPrice: number,
  bps: bigint,
): bigint => {
  const currentBin = getBinByPrice(currentPrice, bps)

  const centralBinLiquidity = createSpotShape({
    token1Amount: tokenYAmount,
    currentPrice,
    autocomplete: 'x',
    fromBin: currentBin,
    toBin: currentBin,
    bps,
    fallbackRatio: 1,
  })

  return centralBinLiquidity.token0Amount
}

/**
 * Calculates the amount of token Y needed for a central bin position given an amount of token X
 * @param tokenXAmount - The amount of token X to provide
 * @param currentPrice - The current price of the token pair
 * @param bps - The basis points for bin spacing
 * @returns The calculated amount of token Y required
 */
export const calculateCentralAmountYByAmountX = (
  tokenXAmount: bigint,
  currentPrice: number,
  bps: bigint,
): bigint => {
  const currentBin = getBinByPrice(currentPrice, bps)

  const centralBinLiquidity = createSpotShape({
    token0Amount: tokenXAmount,
    currentPrice,
    autocomplete: 'y',
    fromBin: currentBin,
    toBin: currentBin,
    bps,
    fallbackRatio: 1,
  })

  return centralBinLiquidity.token1Amount
}
