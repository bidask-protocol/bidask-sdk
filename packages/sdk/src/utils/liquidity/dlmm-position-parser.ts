import BigNumber from 'bignumber.js'

/**
 * Represents a dictionary mapping bin numbers to their values
 */
export type BinDict = Record<number, bigint>

/**
 * Represents a user's position in a specific bin
 */
export interface UserPosition {
  x: bigint
  y: bigint
}

/**
 * Result of calculating user positions across all bins
 */
export type UserPositions = Record<number, UserPosition>

/**
 * Input parameters for calculating user positions
 */
export interface CalculateUserPositionsParams {
  /** Dictionary of LP token amounts per bin owned by the user */
  lpDict: BinDict
  /** Dictionary of total liquidity per bin in the pool */
  totalLiquidityDict: BinDict
  /** Dictionary of total LP supply per bin */
  lpSupplyDict: BinDict
  /** Current square root price (as a decimal, not scaled by 2^128) */
  sqrtPrice: number
  /** Bin step used for price calculations */
  binStep: bigint
}

// Constants
const SCALE_FACTOR = new BigNumber(2).pow(128)

/**
 * Calculates the price bounds for a given bin
 * Returns [lower_bound, upper_bound] as a tuple
 */
function priceBounds(bin: number, binStep: number): [number, number] {
  const basisPoint = (10000 + binStep) / 10000

  if (bin % 2 === 0) {
    // Even bin: [bp^(bin/2), bp^(bin/2) * bp^0.5]
    const lower = Math.pow(basisPoint, bin / 2)
    const upper = lower * Math.sqrt(basisPoint)
    return [lower, upper]
  } else {
    // Odd bin: [bp^(bin//2) * bp^0.5, bp^((bin+1)/2)]
    const lower = Math.pow(basisPoint, Math.floor(bin / 2)) * Math.sqrt(basisPoint)
    const upper = Math.pow(basisPoint, (bin + 1) / 2)
    return [lower, upper]
  }
}

/**
 * Calculates the x-axis token amount for a given liquidity and price bounds
 * Formula: L * (sb - sp) / (sp * sb)
 * where sp is clamped to [sa, sb]
 */
function calculateX(L: bigint, sp: number, sa: number, sb: number): BigNumber {
  // Clamp sp to be within [sa, sb]
  const clampedSp = Math.max(Math.min(sp, sb), sa)

  // Convert L to BigNumber for precise arithmetic
  const L_bn = new BigNumber(L.toString())

  // Calculate: L * (sb - sp) / (sp * sb)
  return L_bn.times(sb - clampedSp).dividedBy(clampedSp * sb)
}

/**
 * Calculates the y-axis token amount for a given liquidity and price bounds
 * Formula: L * (sp - sa)
 * where sp is clamped to [sa, sb]
 */
function calculateY(L: bigint, sp: number, sa: number, sb: number): BigNumber {
  // Clamp sp to be within [sa, sb]
  const clampedSp = Math.max(Math.min(sp, sb), sa)

  // Convert L to BigNumber for precise arithmetic
  const L_bn = new BigNumber(L.toString())

  // Calculate: L * (sp - sa)
  return L_bn.times(clampedSp - sa)
}

/**
 * Calculates user positions across all bins based on their LP tokens
 *
 * Algorithm:
 * 1. Calculate the ratio of total liquidity to LP supply for each bin
 * 2. For each bin where user has LP tokens:
 *    - Calculate price bounds for the bin
 *    - Calculate raw x and y token amounts
 *    - Scale down by 2^128 and multiply by the liquidity ratio
 *    - Store as bigint token amounts
 *
 * @param params - Calculation parameters including LP holdings and pool state
 * @returns Dictionary mapping bin numbers to user positions (x, y token amounts)
 */
export function calculateUserPositions(params: CalculateUserPositionsParams): UserPositions {
  const { lpDict, totalLiquidityDict, lpSupplyDict, sqrtPrice, binStep } = params

  const modifiedLpDict = Object.fromEntries(
    Object.entries(lpDict).map(([bin, amount]) => [bin, amount << 12n]),
  )

  // Step 1: Calculate liquidity ratios for each bin
  // ratio[bin] = total_liquidity[bin] / lp_supply[bin]
  const ratios: Record<number, BigNumber> = {}

  for (const binKey in lpSupplyDict) {
    const bin = Number(binKey)
    if (lpSupplyDict[bin] !== 0n) {
      const totalLiq = new BigNumber(totalLiquidityDict[bin].toString())
      const lpSupply = new BigNumber(lpSupplyDict[bin].toString())
      ratios[bin] = totalLiq.dividedBy(lpSupply)
    }
  }

  // Step 2: Calculate user positions for each bin where they hold LP tokens
  const userPositions: UserPositions = {}

  for (const binKey in modifiedLpDict) {
    const bin = Number(binKey)

    // Skip bins with no LP tokens
    if (modifiedLpDict[bin] === 0n) continue

    // Skip bins where we couldn't calculate a ratio (no LP supply)
    if (!ratios[bin]) continue

    // Get price bounds for this bin
    const [sa, sb] = priceBounds(bin, Number(binStep))

    // Calculate raw token amounts (still scaled by 2^128)
    const x_raw = calculateX(modifiedLpDict[bin], sqrtPrice, sa, sb).dividedBy(SCALE_FACTOR)
    const y_raw = calculateY(modifiedLpDict[bin], sqrtPrice, sa, sb).dividedBy(SCALE_FACTOR)

    // Scale down by 2^128 and multiply by liquidity ratio
    const x_final = x_raw.times(ratios[bin])
    const y_final = y_raw.times(ratios[bin])

    // Convert to bigint (floor to nearest integer)
    userPositions[bin] = {
      x: BigInt(x_final.integerValue(BigNumber.ROUND_DOWN).toString()),
      y: BigInt(y_final.integerValue(BigNumber.ROUND_DOWN).toString()),
    }
  }

  return userPositions
}
