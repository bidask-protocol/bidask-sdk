[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / createTradeAccountDepositTxParams

# Function: createTradeAccountDepositTxParams()

> **createTradeAccountDepositTxParams**(`params`): [`TxParams`](../type-aliases/TxParams.md)[]

Defined in: [transactions/trade-account-deposit.ts:21](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/transactions/trade-account-deposit.ts#L21)

Creates a transaction parameters for depositing tokens into a trade account

## Parameters

### params

Parameters for the transaction

#### poolAddress

`Address`

Address of the pool contract

#### publicKey

`Buffer`

Public key of the trading account

#### seed

`number`

Seed of the trading account

#### senderAddress

`Address`

Address of the sender

#### token0Amount

`bigint`

Amount of token0 to deposit

#### token0UserWalletAddress

`Address`

Address of the token0 user wallet

#### token1Amount

`bigint`

Amount of token1 to deposit

#### token1UserWalletAddress

`Address`

Address of the token1 user wallet

#### userAddress

`Address`

Address of the user

## Returns

[`TxParams`](../type-aliases/TxParams.md)[]
