[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createDeployJettonLimitOrderTxParams

# Function: createDeployJettonLimitOrderTxParams()

> **createDeployJettonLimitOrderTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/deploy-jetton-limit-order.ts:19](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/deploy-jetton-limit-order.ts#L19)

Creates transaction parameters for creating a limit order pool
It actually creates a limit order within a limit pool

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

#### sellJettonWalletAddress

`Address`

#### senderAddress

`Address`

## Returns

[`TxParams`](../type-aliases/TxParams.md)
