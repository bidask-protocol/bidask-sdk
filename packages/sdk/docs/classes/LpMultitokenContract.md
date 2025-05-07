[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / LpMultitokenContract

# Class: LpMultitokenContract

Defined in: [contracts/LpMultitokenContract.ts:3](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/LpMultitokenContract.ts#L3)

## Implements

- `Contract`

## Properties

### address

> **address**: `Address`

Defined in: [contracts/LpMultitokenContract.ts:13](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/LpMultitokenContract.ts#L13)

#### Implementation of

`Contract.address`

***

### Opcodes

> `static` **Opcodes**: `object`

Defined in: [contracts/LpMultitokenContract.ts:4](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/LpMultitokenContract.ts#L4)

#### Burn

> **Burn**: `number` = `0x73403c43`

#### BurnAll

> **BurnAll**: `number` = `0xebd6ec83`

## Methods

### getBinsNumber()

> **getBinsNumber**(`provider`): `Promise`\<`number`\>

Defined in: [contracts/LpMultitokenContract.ts:49](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/LpMultitokenContract.ts#L49)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`number`\>

***

### getTokens()

> **getTokens**(`provider`): `Promise`\<`Record`\<`number`, `bigint`\>\>

Defined in: [contracts/LpMultitokenContract.ts:15](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/LpMultitokenContract.ts#L15)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`Record`\<`number`, `bigint`\>\>

***

### create()

> `static` **create**(`address`): `LpMultitokenContract`

Defined in: [contracts/LpMultitokenContract.ts:9](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/LpMultitokenContract.ts#L9)

#### Parameters

##### address

`Address`

#### Returns

`LpMultitokenContract`
