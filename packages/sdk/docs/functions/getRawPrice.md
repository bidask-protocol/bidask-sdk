[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / getRawPrice

# Function: getRawPrice()

> **getRawPrice**(`humanReadablePrice`, `jetton0Decimals`, `jetton1Decimals`): `number`

Defined in: [utils/price.ts:43](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/utils/price.ts#L43)

Converts a human-readable price to its blockchain representation accounting for decimal differences

## Parameters

### humanReadablePrice

`number`

Price in human-readable format (as if tokens had same decimal places)

### jetton0Decimals

`number`

Number of decimal places for the first token

### jetton1Decimals

`number`

Number of decimal places for the second token

## Returns

`number`

Price adjusted for the blockchain with proper decimal scaling
