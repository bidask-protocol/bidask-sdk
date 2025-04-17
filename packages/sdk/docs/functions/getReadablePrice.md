[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / getReadablePrice

# Function: getReadablePrice()

> **getReadablePrice**(`rawPrice`, `jetton0Decimals`, `jetton1Decimals`): `number`

Defined in: [utils/price.ts:27](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/utils/price.ts#L27)

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
