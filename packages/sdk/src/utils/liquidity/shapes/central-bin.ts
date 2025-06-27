import { getBinByPrice } from '../../bins'
import { createSpotShape } from './spot-shape'

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
