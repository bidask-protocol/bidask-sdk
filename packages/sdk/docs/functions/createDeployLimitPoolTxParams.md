[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createDeployLimitPoolTxParams

# Function: createDeployLimitPoolTxParams()

> **createDeployLimitPoolTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/deploy-limit-pool.ts:14](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/deploy-limit-pool.ts#L14)

Creates transaction parameters for deploying a limit pool

## Parameters

### params

Parameters for deployment

#### queryId?

`bigint`

Query ID (default: 0n)

#### seedCell

`Cell`

#### token0PoolWalletAddress

`Address`

#### token1PoolWalletAddress

`Address`

## Returns

[`TxParams`](../type-aliases/TxParams.md)
