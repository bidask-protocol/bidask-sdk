[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / createProvideNativeLiquidityTxParams

# Function: createProvideNativeLiquidityTxParams()

> **createProvideNativeLiquidityTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)

Defined in: [transactions/provide-native-liquidity.ts:23](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/transactions/provide-native-liquidity.ts#L23)

Creates a transaction parameters for providing liquidity to a TON/Jetton pool

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

#### jettonAmount

`bigint`

Amount of token to provide

#### jettonWalletAddress

`Address`

Address of the token Jetton wallet

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

#### tonAmount

`bigint`

Amount of TON to provide

## Returns

[`TxParams`](../type-aliases/TxParams.md)

Transaction parameters
