[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createDeployTonLimitOrderTxParams

# Function: createDeployTonLimitOrderTxParams()

> **createDeployTonLimitOrderTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/deploy-ton-limit-order.ts:17](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/deploy-ton-limit-order.ts#L17)

Creates transaction parameters for deploying a limit order pool

## Parameters

### params

Order parameters

#### buyAmount

`bigint`

Amount of Y to buy

#### finalPayload?

`Cell`

Optional final payload cell

#### poolAddress

`Address`

#### queryId?

`bigint`

Query ID (default: 0n)

#### reward

`bigint`

Reward in TON for executors

#### salt

`bigint`

Salt for shard brute-forcing

#### sellAmount

`bigint`

Amount of X to sell

## Returns

[`TxParams`](../type-aliases/TxParams.md)
