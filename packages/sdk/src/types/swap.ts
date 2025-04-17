/**
 * Parameters for swap operations that control partial execution behavior
 */
export type SwapPartialExecutionParams =
  | {
      /** Allow partial swap execution */
      allowPartial: true
      /** Minimum/maximum allowed price in sqrt price X 2^128 format */
      sqrtX128LastPrice: bigint
    }
  | {
      /** Disallow partial swap execution */
      allowPartial: false
      /** Minimum amount expected to receive from the swap */
      minAmountToReceive: bigint
    }
