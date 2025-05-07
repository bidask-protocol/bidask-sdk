[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / SwapPartialExecutionParams

# Type Alias: SwapPartialExecutionParams

> **SwapPartialExecutionParams** = \{ `allowPartial`: `true`; `sqrtX128LastPrice`: `bigint`; \} \| \{ `allowPartial`: `false`; `minAmountToReceive`: `bigint`; \}

Defined in: [types/swap.ts:4](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/swap.ts#L4)

Parameters for swap operations that control partial execution behavior

## Type declaration

\{ `allowPartial`: `true`; `sqrtX128LastPrice`: `bigint`; \}

### allowPartial

> **allowPartial**: `true`

Allow partial swap execution

### sqrtX128LastPrice

> **sqrtX128LastPrice**: `bigint`

Minimum/maximum allowed price in sqrt price X 2^128 format

\{ `allowPartial`: `false`; `minAmountToReceive`: `bigint`; \}

### allowPartial

> **allowPartial**: `false`

Disallow partial swap execution

### minAmountToReceive

> **minAmountToReceive**: `bigint`

Minimum amount expected to receive from the swap
