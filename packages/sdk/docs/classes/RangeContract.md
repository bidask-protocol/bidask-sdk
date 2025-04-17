[**@foprta/sdk**](../README.md)

***

[@foprta/sdk](../globals.md) / RangeContract

# Class: RangeContract

Defined in: [contracts/RangeContract.ts:3](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/RangeContract.ts#L3)

## Implements

- `Contract`

## Properties

### address

> **address**: `Address`

Defined in: [contracts/RangeContract.ts:8](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/RangeContract.ts#L8)

#### Implementation of

`Contract.address`

## Methods

### getLpMultitokenWallet()

> **getLpMultitokenWallet**(`provider`, `userAddress`): `Promise`\<`Address`\>

Defined in: [contracts/RangeContract.ts:16](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/RangeContract.ts#L16)

#### Parameters

##### provider

`ContractProvider`

##### userAddress

`Address`

#### Returns

`Promise`\<`Address`\>

***

### getSqrtPrice()

> **getSqrtPrice**(`provider`): `Promise`\<`bigint`\>

Defined in: [contracts/RangeContract.ts:10](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/RangeContract.ts#L10)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`bigint`\>

***

### create()

> `static` **create**(`address`): `RangeContract`

Defined in: [contracts/RangeContract.ts:4](https://github.com/bidask-protocol/bidask-sdk/blob/9a0a4707cd57b081e295f71ea9b8f0b19f6c835c/packages/sdk/src/contracts/RangeContract.ts#L4)

#### Parameters

##### address

`Address`

#### Returns

`RangeContract`
