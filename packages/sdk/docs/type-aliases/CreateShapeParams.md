[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / CreateShapeParams

# Type Alias: CreateShapeParams

> **CreateShapeParams** = `object`

Defined in: [types/liquidity.ts:31](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L31)

Parameters for creating a liquidity shape

## Properties

### bps

> **bps**: `bigint`

Defined in: [types/liquidity.ts:43](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L43)

Basis points for fee calculation

***

### currentPrice

> **currentPrice**: `number`

Defined in: [types/liquidity.ts:37](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L37)

Current price of the pool

***

### fallbackRatio?

> `optional` **fallbackRatio**: `number`

Defined in: [types/liquidity.ts:49](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L49)

Ratio of liquidity to distribute from active bin to other bins (0-1) in case of central bin takes all of the liquidity

#### Default

```ts
0.8
```

***

### fromBin

> **fromBin**: `number`

Defined in: [types/liquidity.ts:39](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L39)

Starting bin index

***

### toBin

> **toBin**: `number`

Defined in: [types/liquidity.ts:41](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L41)

Ending bin index

***

### token0Amount

> **token0Amount**: `bigint`

Defined in: [types/liquidity.ts:33](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L33)

Amount of token0 to provide

***

### token1Amount

> **token1Amount**: `bigint`

Defined in: [types/liquidity.ts:35](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/types/liquidity.ts#L35)

Amount of token1 to provide
