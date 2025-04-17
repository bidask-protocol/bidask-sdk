[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / createDeployPoolTxParams

# Function: createDeployPoolTxParams()

> **createDeployPoolTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/deploy-pool.ts:18](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/transactions/deploy-pool.ts#L18)

Creates a transaction parameters for deploying a pool

## Parameters

### params

Parameters for the transaction

#### bps

`bigint`

Basis points for fee calculation

#### initialPrice

`number`

Initial price of the pool

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
