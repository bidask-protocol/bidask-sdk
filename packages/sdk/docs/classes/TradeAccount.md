[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / TradeAccount

# Class: TradeAccount

Defined in: [contracts/TradeAccountContract.ts:37](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L37)

## Implements

- `Contract`

## Constructors

### Constructor

> **new TradeAccount**(`address`, `init?`): `TradeAccount`

Defined in: [contracts/TradeAccountContract.ts:46](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L46)

#### Parameters

##### address

`Address`

##### init?

###### code

`Cell`

###### data

`Cell`

#### Returns

`TradeAccount`

## Properties

### address

> `readonly` **address**: `Address`

Defined in: [contracts/TradeAccountContract.ts:47](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L47)

#### Implementation of

`Contract.address`

***

### init?

> `readonly` `optional` **init**: `object`

Defined in: [contracts/TradeAccountContract.ts:48](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L48)

#### code

> **code**: `Cell`

#### data

> **data**: `Cell`

#### Implementation of

`Contract.init`

***

### Opcodes

> `readonly` `static` **Opcodes**: `object`

Defined in: [contracts/TradeAccountContract.ts:38](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L38)

#### CancelLimitOrder

> **CancelLimitOrder**: `number` = `0x30a1507b`

#### DepositOnAccount

> **DepositOnAccount**: `number` = `0xd8e04bf6`

#### LimitOrder

> **LimitOrder**: `number` = `0x1111684f`

#### Swap

> **Swap**: `number` = `0xefbbd1b8`

#### Withdraw

> **Withdraw**: `number` = `0xa3dbaae5`

## Methods

### getDepositBalance()

> **getDepositBalance**(`provider`): `Promise`\<\{ `token0Amount`: `bigint`; `token1Amount`: `bigint`; \}\>

Defined in: [contracts/TradeAccountContract.ts:216](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L216)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<\{ `token0Amount`: `bigint`; `token1Amount`: `bigint`; \}\>

***

### getPoolAddress()

> **getPoolAddress**(`provider`): `Promise`\<`Address`\>

Defined in: [contracts/TradeAccountContract.ts:223](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L223)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`Address`\>

***

### getSeqno()

> **getSeqno**(`provider`): `Promise`\<`number`\>

Defined in: [contracts/TradeAccountContract.ts:228](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L228)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`number`\>

***

### sendDeploy()

> **sendDeploy**(`provider`, `via`, `value`): `Promise`\<`void`\>

Defined in: [contracts/TradeAccountContract.ts:61](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L61)

#### Parameters

##### provider

`ContractProvider`

##### via

`Sender`

##### value

`bigint`

#### Returns

`Promise`\<`void`\>

***

### sendDeposit()

> **sendDeposit**(`provider`, `via`, `opts`, `value`): `Promise`\<`void`\>

Defined in: [contracts/TradeAccountContract.ts:68](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L68)

#### Parameters

##### provider

`ContractProvider`

##### via

`Sender`

##### opts

###### amount1

`bigint`

###### amount2

`bigint`

###### newCode?

`Cell`

##### value

`bigint` = `...`

#### Returns

`Promise`\<`void`\>

***

### sendExternalSignedMessage()

> **sendExternalSignedMessage**(`provider`, `body`): `Promise`\<`void`\>

Defined in: [contracts/TradeAccountContract.ts:212](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L212)

#### Parameters

##### provider

`ContractProvider`

##### body

`Cell`

#### Returns

`Promise`\<`void`\>

***

### sendExternalSwap()

> **sendExternalSwap**(`provider`, `keypair`, `validUntil`, `seqno`, `poolAddress`, `seed`, `params`): `Promise`\<`void`\>

Defined in: [contracts/TradeAccountContract.ts:111](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L111)

Send swap

#### Parameters

##### provider

`ContractProvider`

Contract provider

##### keypair

`KeyPair`

Key pair

##### validUntil

`number`

Valid until

##### seqno

`number`

Seqno

##### poolAddress

`Address`

Pool address

##### seed

`Cell`

Seed

##### params

`object` & [`SwapPartialExecutionParams`](../type-aliases/SwapPartialExecutionParams.md)

Options

#### Returns

`Promise`\<`void`\>

***

### sendExternalWithdraw()

> **sendExternalWithdraw**(`provider`, `keypair`, `validUntil`, `seqno`, `poolAddress`, `seed`, `params`): `Promise`\<`void`\>

Defined in: [contracts/TradeAccountContract.ts:176](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L176)

Withdraw tokens from trading account

#### Parameters

##### provider

`ContractProvider`

Contract provider

##### keypair

`KeyPair`

Key pair

##### validUntil

`number`

Valid until

##### seqno

`number`

Seqno

##### poolAddress

`Address`

Pool address

##### seed

`Cell`

Seed

##### params

Options

###### amount?

`bigint`

Amount (default: 0.3 TON)

###### mode?

`number`

SendMode (default: CARRY_ALL_REMAINING_BALANCE)

###### receiverAddress

`Address`

Receiver address

###### token0Amount

`bigint`

Token0 amount

###### token1Amount

`bigint`

Token1 amount

#### Returns

`Promise`\<`void`\>

***

### createFromAddress()

> `static` **createFromAddress**(`address`): `TradeAccount`

Defined in: [contracts/TradeAccountContract.ts:51](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L51)

#### Parameters

##### address

`Address`

#### Returns

`TradeAccount`

***

### createFromConfig()

> `static` **createFromConfig**(`config`, `code`, `workchain`): `TradeAccount`

Defined in: [contracts/TradeAccountContract.ts:55](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/TradeAccountContract.ts#L55)

#### Parameters

##### config

`TradeAccountConfig`

##### code

`Cell`

##### workchain

`number` = `0`

#### Returns

`TradeAccount`
