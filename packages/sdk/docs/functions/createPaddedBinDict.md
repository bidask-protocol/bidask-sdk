[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createPaddedBinDict

# Function: createPaddedBinDict()

> **createPaddedBinDict**\<`BinValue`, `Bins`, `Result`\>(`params`): `Result`

Defined in: [utils/liquidity/dictionary.ts:16](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/utils/liquidity/dictionary.ts#L16)

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
