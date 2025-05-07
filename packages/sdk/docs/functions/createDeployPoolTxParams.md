[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createDeployPoolTxParams

# Function: createDeployPoolTxParams()

> **createDeployPoolTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/deploy-pool.ts:18](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/deploy-pool.ts#L18)

Creates a transaction parameters for deploying a pool

## Parameters

### params

Parameters for the transaction

#### bps

`bigint`

Basis points for fee calculation

#### initialRawPrice

`number`

Initial raw price of the pool

#### lpFee

`bigint`

Liquidity provider fee

#### seedCell

`Cell`

Seed cell for the pool

#### token0PoolWalletAddress

`Address`

Address of the token0 pool wallet

#### token1PoolWalletAddress

`Address`

Address of the token1 pool wallet

## Returns

[`TxParams`](../type-aliases/TxParams.md)
