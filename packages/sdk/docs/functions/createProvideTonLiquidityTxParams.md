[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createProvideTonLiquidityTxParams

# Function: createProvideTonLiquidityTxParams()

> **createProvideTonLiquidityTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)[]

Defined in: [transactions/provide-ton-liquidity.ts:22](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/provide-ton-liquidity.ts#L22)

Creates a transaction parameters for providing liquidity to a TON/Jetton pool

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

#### jettonWalletAddress

`Address`

Address of the token Jetton wallet

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
