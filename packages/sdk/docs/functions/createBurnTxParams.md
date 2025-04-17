[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / createBurnTxParams

# Function: createBurnTxParams()

> **createBurnTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/burn.ts:15](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/transactions/burn.ts#L15)

Creates a transaction parameters for burning liquidity from a pool

## Parameters

### params

Parameters for the transaction

#### binsToBurn

[`LiquidityRemoveBins`](../type-aliases/LiquidityRemoveBins.md)

Bins to burn

#### lpMultitokenAddress

`Address`

Address of the liquidity pool contract

## Returns

[`TxParams`](../type-aliases/TxParams.md)

Transaction parameters
