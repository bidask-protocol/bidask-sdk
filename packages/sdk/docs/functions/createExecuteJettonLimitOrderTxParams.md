[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createExecuteJettonLimitOrderTxParams

# Function: createExecuteJettonLimitOrderTxParams()

> **createExecuteJettonLimitOrderTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/execute-jetton-limit-order.ts:19](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/execute-jetton-limit-order.ts#L19)

Creates transaction parameters to execute a limit order by sending Jettons

## Parameters

### params

Execution parameters

#### forwardPayload?

`Cell`

Optional payload on success

#### orderIndex

`bigint`

Index of the limit order on the pool

#### poolAddress

`Address`

#### queryId?

`bigint`

Query ID (default: 0n)

#### rejectPayload?

`Cell`

Optional payload on failure

#### salt

`bigint`

Salt for shard brute-forcing

#### sellAmount

`bigint`

#### sellJettonWalletAddress

`Address`

#### senderAddress

`Address`

## Returns

[`TxParams`](../type-aliases/TxParams.md)
