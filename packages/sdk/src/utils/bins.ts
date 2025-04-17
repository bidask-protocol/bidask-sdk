import { BIN_STEP_COEFFICIENT } from '../constants'

/**
 * Gets the bin index by price
 * @param price - The price
 * @param bps - The basis points
 * @returns The bin index
 */
export const getBinByPrice = (price: number, bps: bigint) => {
  return Math.floor(Math.log(price) / Math.log(1 + Number(bps) / BIN_STEP_COEFFICIENT))
}

/**
 * Gets the price by bin
 * @param bin - The bin index
 * @param bps - The basis points
 * @returns The price
 */
export const getPriceByBin = (bin: number, bps: bigint): number => {
  return (1 + Number(bps) / BIN_STEP_COEFFICIENT) ** bin
}

/**
 * Gets the bin price bounds
 * @param bin - The bin index
 * @param bps - The basis points
 * @returns The bin price bounds
 */
export const getBinPriceBounds = (bin: number, bps: bigint) => {
  return [getPriceByBin(bin, bps), getPriceByBin(bin + 1, bps)]
}
