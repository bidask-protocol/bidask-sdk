import { BINS_PER_RANGE, RANGE_OFFEST } from '../constants'

/**
 * Gets the range number by bin
 * @param bin - The bin
 * @returns The range
 */
export const getRangeByBin = (bin: number): number => {
  return Math.floor((bin + RANGE_OFFEST) / BINS_PER_RANGE)
}

/**
 * Gets the first bin by range
 * @param range - The range
 * @returns The first bin
 */
export const getFirstBinByRange = (range: number): number => {
  return range * BINS_PER_RANGE - RANGE_OFFEST
}
