[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / createPaddedBinDict

# Function: createPaddedBinDict()

> **createPaddedBinDict**\<`BinValue`, `Bins`, `Result`\>(`params`): `Result`

Defined in: [utils/liquidity/dictionary.ts:14](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/utils/liquidity/dictionary.ts#L14)

Allows you to create bin dictionaries padded with placeholder bins in the start and end of binDictionary

## Type Parameters

### BinValue

`BinValue` *extends* `unknown`

### Bins

`Bins` *extends* `Record`\<`number`, `BinValue`\>

### Result

`Result`

## Parameters

### params

The parameters

#### bins

`Bins`

The bins

#### emptyBin

`BinValue`

Placeholder for the empty bin

#### iterator

(`paddedBinDict`, `result`, `binDictIndex`) => `Result`

The iterator

#### result

`Result`

The result

## Returns

`Result`
