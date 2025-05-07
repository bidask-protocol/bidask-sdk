[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createBurnTxParams

# Function: createBurnTxParams()

> **createBurnTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/burn.ts:15](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/burn.ts#L15)

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
