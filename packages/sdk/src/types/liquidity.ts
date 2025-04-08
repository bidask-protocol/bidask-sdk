export enum LiquidityType {
  TwoSides = 0,
  OneSide = 1,
}

export type LiquidityProvideBins = Record<number, [bigint, bigint]>

export type LiquidityRemoveBins = Record<number, bigint>

export type CreateShapeParams = {
  token0Amount: bigint
  token1Amount: bigint
  currentPrice: number
  fromBin: number
  toBin: number
  bps: bigint
}
