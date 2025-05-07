[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createCancelLimitOrderTxParams

# Function: createCancelLimitOrderTxParams()

> **createCancelLimitOrderTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/cancel-limit-order.ts:11](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/cancel-limit-order.ts#L11)

Creates transaction parameters for canceling a limit order

## Parameters

### params

Cancellation parameters

#### orderAddress

`Address`

Address of the limit order contract

#### queryId?

`bigint`

Query ID (default: 0n)

## Returns

[`TxParams`](../type-aliases/TxParams.md)
