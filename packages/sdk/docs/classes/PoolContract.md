[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / PoolContract

# Class: PoolContract

Defined in: [contracts/PoolContract.ts:8](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L8)

## Implements

- `Contract`

## Properties

### address

> **address**: `Address`

Defined in: [contracts/PoolContract.ts:19](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L19)

#### Implementation of

`Contract.address`

***

### Opcodes

> `static` **Opcodes**: `object`

Defined in: [contracts/PoolContract.ts:9](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L9)

#### AddBothLiquidity

> **AddBothLiquidity**: `number` = `0x3ea0bafc`

#### AddLiquidity

> **AddLiquidity**: `number` = `0x96feef7b`

#### Swap

> **Swap**: `number` = `0xf2ef6c1b`

## Methods

### getActiveRange()

> **getActiveRange**(`provider`): `Promise`\<`Address`\>

Defined in: [contracts/PoolContract.ts:32](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L32)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`Address`\>

***

### getPoolInfo()

> **getPoolInfo**(`provider`): `Promise`\<[`PoolInfo`](../type-aliases/PoolInfo.md)\>

Defined in: [contracts/PoolContract.ts:21](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L21)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<[`PoolInfo`](../type-aliases/PoolInfo.md)\>

***

### getRangeAddress()

> **getRangeAddress**(`provider`, `firstBin`): `Promise`\<`Address`\>

Defined in: [contracts/PoolContract.ts:51](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L51)

#### Parameters

##### provider

`ContractProvider`

##### firstBin

`number`

#### Returns

`Promise`\<`Address`\>

***

### getRangesStatusesByLiquidityBins()

> **getRangesStatusesByLiquidityBins**(`provider`, `liquidityBins`): `Promise`\<`Record`\<`number`, [`RangeStatus`](../enumerations/RangeStatus.md)\>\>

Defined in: [contracts/PoolContract.ts:59](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L59)

#### Parameters

##### provider

`ContractProvider`

##### liquidityBins

[`LiquidityProvideBins`](../type-aliases/LiquidityProvideBins.md)

#### Returns

`Promise`\<`Record`\<`number`, [`RangeStatus`](../enumerations/RangeStatus.md)\>\>

***

### getRangeStatus()

> **getRangeStatus**(`provider`, `range`): `Promise`\<[`RangeStatus`](../enumerations/RangeStatus.md)\>

Defined in: [contracts/PoolContract.ts:84](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L84)

#### Parameters

##### provider

`ContractProvider`

##### range

`number`

#### Returns

`Promise`\<[`RangeStatus`](../enumerations/RangeStatus.md)\>

***

### getTradeAccountAddress()

> **getTradeAccountAddress**(`provider`, `params`): `Promise`\<`Address`\>

Defined in: [contracts/PoolContract.ts:38](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L38)

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

Defined in: [contracts/PoolContract.ts:15](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/PoolContract.ts#L15)

#### Parameters

##### address

`Address`

#### Returns

`PoolContract`
