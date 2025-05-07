[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / RangeContract

# Class: RangeContract

Defined in: [contracts/RangeContract.ts:3](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/RangeContract.ts#L3)

## Implements

- `Contract`

## Properties

### address

> **address**: `Address`

Defined in: [contracts/RangeContract.ts:8](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/RangeContract.ts#L8)

#### Implementation of

`Contract.address`

## Methods

### getLpMultitokenWallet()

> **getLpMultitokenWallet**(`provider`, `userAddress`): `Promise`\<`Address`\>

Defined in: [contracts/RangeContract.ts:16](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/RangeContract.ts#L16)

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

Defined in: [contracts/RangeContract.ts:10](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/RangeContract.ts#L10)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`bigint`\>

***

### create()

> `static` **create**(`address`): `RangeContract`

Defined in: [contracts/RangeContract.ts:4](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/RangeContract.ts#L4)

#### Parameters

##### address

`Address`

#### Returns

`RangeContract`
