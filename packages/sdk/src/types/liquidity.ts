declare const _liquidityProvideBins: unique symbol

/**
 * Types of deposit operations
 */
export enum DepositType {
  Initial = 0,
  Add = 1,
  Update = 2,
}

/**
 * Types of liquidity operations
 */
export enum LiquidityType {
  TwoSides = 0,
  OneSide = 1,
}

/**
 * Record of liquidity provide bins where the key is the bin index and the value is the amount of token0 and token1 to provide
 *
 * @warning Due to branded typing, use `as LiquidityProvideBins` instead of `: LiquidityProvideBins` when creating objects
 */
export type LiquidityProvideBins = Record<number, [bigint, bigint]> & {
  readonly [_liquidityProvideBins]: void
}

/**
 * Result of shape creator
 */
export type ShapeCreatorResult = {
  bins: LiquidityProvideBins
  token0Amount: bigint
  token1Amount: bigint
}

/**
 * Record of liquidity remove bins where the key is the bin index and the value is the amount of lpToken to remove
 */
export type LiquidityRemoveBins = Record<number, bigint>

/**
 * Parameters for creating a liquidity shape
 */
export type CreateShapeParams = {
  /** Amount of token0 to provide */
  token0Amount?: bigint
  /** Amount of token1 to provide */
  token1Amount?: bigint
  /** Autocomplete token side */
  autocomplete?: 'x' | 'y' | null
  /** Current price of the pool */
  currentPrice: number
  /** Starting bin index */
  fromBin: number
  /** Ending bin index */
  toBin: number
  /** Basis points for fee calculation */
  bps: bigint
  /**
   * Ratio of liquidity to distribute from active bin to other bins (0-1) in case of central bin takes all of the liquidity
   *
   * @default 1
   */
  baseRatio?: number
  /**
   * Ratio of liquidity to distribute from active bin to other bins (0-1) in case of central bin takes all of the liquidity
   *
   * @default 0.8 (for curve and spot shape)
   * @default 0.2 (for bidask shape)
   */
  fallbackRatio?: number
}
