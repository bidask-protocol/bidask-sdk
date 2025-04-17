[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / createProvideLiquidityTxParams

# Function: createProvideLiquidityTxParams()

> **createProvideLiquidityTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)[]

Defined in: [transactions/provide-liquidity.ts:24](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/transactions/provide-liquidity.ts#L24)

Creates a transaction parameters for providing liquidity to a Jetton/Jetton pool

## Parameters

### params

Parameters for the transaction

#### binsToProvide

[`LiquidityProvideBins`](../type-aliases/LiquidityProvideBins.md)

Bins to provide

#### depositType

[`DepositType`](../enumerations/DepositType.md)

Type of deposit

#### forwardPayload?

`Cell`

Forward payload

#### jettonAmount0

`bigint`

Amount of token0 to provide

#### jettonAmount1

`bigint`

Amount of token1 to provide

#### jettonWalletAddress0

`Address`

Address of the token0 Jetton wallet

#### jettonWalletAddress1

`Address`

Address of the token1 Jetton wallet

#### liquidityType

[`LiquidityType`](../enumerations/LiquidityType.md)

Type of liquidity

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

Transaction parameters
