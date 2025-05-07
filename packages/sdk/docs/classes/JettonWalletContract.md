[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / JettonWalletContract

# Class: JettonWalletContract

Defined in: [contracts/JettonWalletContract.ts:3](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/JettonWalletContract.ts#L3)

## Implements

- `Contract`

## Properties

### address

> **address**: `Address`

Defined in: [contracts/JettonWalletContract.ts:12](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/JettonWalletContract.ts#L12)

#### Implementation of

`Contract.address`

***

### Opcodes

> `static` **Opcodes**: `object`

Defined in: [contracts/JettonWalletContract.ts:4](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/JettonWalletContract.ts#L4)

#### JettonTransfer

> **JettonTransfer**: `number` = `0xf8a7ea5`

## Methods

### getWalletData()

> **getWalletData**(`provider`): `Promise`\<\{ `balance`: `bigint`; `jettonMaster`: `Address`; `jettonWalletCode`: `string`; `owner`: `Address`; \}\>

Defined in: [contracts/JettonWalletContract.ts:14](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/JettonWalletContract.ts#L14)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<\{ `balance`: `bigint`; `jettonMaster`: `Address`; `jettonWalletCode`: `string`; `owner`: `Address`; \}\>

***

### create()

> `static` **create**(`address`): `JettonWalletContract`

Defined in: [contracts/JettonWalletContract.ts:8](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/JettonWalletContract.ts#L8)

#### Parameters

##### address

`Address`

#### Returns

`JettonWalletContract`
