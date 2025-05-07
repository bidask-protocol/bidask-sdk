[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createExecuteTonLimitOrderTxParams

# Function: createExecuteTonLimitOrderTxParams()

> **createExecuteTonLimitOrderTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/execute-ton-limit-order.ts:17](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/execute-ton-limit-order.ts#L17)

Creates transaction parameters to execute a limit order using native TON

## Parameters

### params

Execution parameters

#### forwardPayload?

`Cell`

Optional payload on successful swap

#### orderIndex

`bigint`

Index of the limit order on the pool (default: 0n)

#### poolAddress

`Address`

#### queryId?

`bigint`

Query ID (default: 0n)

#### rejectPayload?

`Cell`

Optional payload on unused ton return

#### salt

`bigint`

Salt for shard brute-forcing the order address

#### sellAmount

`bigint`

## Returns

[`TxParams`](../type-aliases/TxParams.md)
