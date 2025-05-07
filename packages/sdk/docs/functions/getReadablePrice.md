[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / getReadablePrice

# Function: getReadablePrice()

> **getReadablePrice**(`rawPrice`, `jetton0Decimals`, `jetton1Decimals`): `number`

Defined in: [utils/price.ts:27](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/utils/price.ts#L27)

Converts a blockchain price to its human-readable representation accounting for decimal differences

## Parameters

### rawPrice

`number`

Price in blockchain format

### jetton0Decimals

`number`

Number of decimal places for the first token

### jetton1Decimals

`number`

Number of decimal places for the second token

## Returns

`number`

Price adjusted for human readability with proper decimal scaling
