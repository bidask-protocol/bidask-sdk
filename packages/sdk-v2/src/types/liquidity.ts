export enum LiquidityType {
  TwoSides = 0,
  OneSide = 1,
}

export type LiquidityProvideBins = Record<number, [bigint, bigint]>

export type LiquidityRemoveBins = Record<number, bigint>
