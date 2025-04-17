[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / PoolContract

# Class: PoolContract

Defined in: [contracts/PoolContract.ts:6](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L6)

## Implements

- `Contract`

## Properties

### address

> **address**: `Address`

Defined in: [contracts/PoolContract.ts:17](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L17)

#### Implementation of

`Contract.address`

***

### Opcodes

> `static` **Opcodes**: `object`

Defined in: [contracts/PoolContract.ts:7](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L7)

#### AddBothLiquidity

> **AddBothLiquidity**: `number` = `0x64dbad78`

#### AddLiquidity

> **AddLiquidity**: `number` = `0x406d7624`

#### Swap

> **Swap**: `number` = `0xca2663c4`

## Methods

### getActiveRange()

> **getActiveRange**(`provider`): `Promise`\<`Address`\>

Defined in: [contracts/PoolContract.ts:30](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L30)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`Address`\>

***

### getPoolInfo()

> **getPoolInfo**(`provider`): `Promise`\<[`PoolInfo`](../type-aliases/PoolInfo.md)\>

Defined in: [contracts/PoolContract.ts:19](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L19)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<[`PoolInfo`](../type-aliases/PoolInfo.md)\>

***

### getTradeAccountAddress()

> **getTradeAccountAddress**(`provider`, `params`): `Promise`\<`Address`\>

Defined in: [contracts/PoolContract.ts:36](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L36)

#### Parameters

##### provider

`ContractProvider`

##### params

###### publicKey

`Buffer`

###### seed

`number`

###### userAddress

`Address`

#### Returns

`Promise`\<`Address`\>

***

### create()

> `static` **create**(`address`): `PoolContract`

Defined in: [contracts/PoolContract.ts:13](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/PoolContract.ts#L13)

#### Parameters

##### address

`Address`

#### Returns

`PoolContract`
