[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createProvideLiquidityTxParams

# Function: createProvideLiquidityTxParams()

> **createProvideLiquidityTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)[]

Defined in: [transactions/provide-liquidity.ts:23](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/provide-liquidity.ts#L23)

Creates a transaction parameters for providing liquidity to a Jetton/Jetton pool

## Parameters

### params

Parameters for the transaction

#### binsToProvide

[`LiquidityProvideBins`](../type-aliases/LiquidityProvideBins.md)

Bins to provide

#### forwardPayload?

`Cell`

Forward payload

#### initializedRanges

`number`[]

Ranges that are already initialized

#### jettonWalletAddress0

`Address`

Address of the token0 Jetton wallet

#### jettonWalletAddress1

`Address`

Address of the token1 Jetton wallet

#### poolAddress

`Address`

Address of the pool

#### rejectPayload?

`Cell`

Reject payload

#### senderAddress

`Address`

Address of the sender

## Returns

[`TxParams`](../type-aliases/TxParams.md)[]

Transactions parameters
