[**@bidask-protocol/sdk**](../README.md)

***

[@bidask-protocol/sdk](../globals.md) / PoolFactory

# Class: PoolFactory

Defined in: [contracts/tact\_PoolFactory.ts:2100](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2100)

## Implements

- `Contract`

## Constructors

### Constructor

> **new PoolFactory**(`address`, `init?`): `PoolFactory`

Defined in: [contracts/tact\_PoolFactory.ts:2164](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2164)

#### Parameters

##### address

`Address`

##### init?

###### code

`Cell`

###### data

`Cell`

#### Returns

`PoolFactory`

## Properties

### abi

> `readonly` **abi**: `ContractABI`

Defined in: [contracts/tact\_PoolFactory.ts:2157](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2157)

#### Implementation of

`Contract.abi`

***

### address

> `readonly` **address**: `Address`

Defined in: [contracts/tact\_PoolFactory.ts:2155](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2155)

#### Implementation of

`Contract.address`

***

### init?

> `readonly` `optional` **init**: `object`

Defined in: [contracts/tact\_PoolFactory.ts:2156](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2156)

#### code

> **code**: `Cell`

#### data

> **data**: `Cell`

#### Implementation of

`Contract.init`

***

### errors

> `readonly` `static` **errors**: `object` = `PoolFactory_errors_backward`

Defined in: [contracts/tact\_PoolFactory.ts:2102](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2102)

#### 'Unknown' error

> `readonly` **'Unknown' error**: `11` = `11`

#### Access denied

> `readonly` **Access denied**: `132` = `132`

#### Account state size exceeded limits

> `readonly` **Account state size exceeded limits**: `50` = `50`

#### Action is invalid or not supported

> `readonly` **Action is invalid or not supported**: `34` = `34`

#### Action list is invalid

> `readonly` **Action list is invalid**: `32` = `32`

#### Action list is too long

> `readonly` **Action list is too long**: `33` = `33`

#### Cannot process a message

> `readonly` **Cannot process a message**: `40` = `40`

#### Cell overflow

> `readonly` **Cell overflow**: `8` = `8`

#### Cell underflow

> `readonly` **Cell underflow**: `9` = `9`

#### Code of a contract was not found

> `readonly` **Code of a contract was not found**: `135` = `135`

#### Constraints error

> `readonly` **Constraints error**: `131` = `131`

#### Contract stopped

> `readonly` **Contract stopped**: `133` = `133`

#### Dictionary error

> `readonly` **Dictionary error**: `10` = `10`

#### Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree

> `readonly` **Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree**: `43` = `43`

#### Fatal error

> `readonly` **Fatal error**: `12` = `12`

#### Integer out of expected range

> `readonly` **Integer out of expected range**: `5` = `5`

#### Integer overflow

> `readonly` **Integer overflow**: `4` = `4`

#### Invalid argument

> `readonly` **Invalid argument**: `134` = `134`

#### Invalid destination address in outbound message

> `readonly` **Invalid destination address in outbound message**: `36` = `36`

#### Invalid incoming message

> `readonly` **Invalid incoming message**: `130` = `130`

#### Invalid opcode

> `readonly` **Invalid opcode**: `6` = `6`

#### Invalid serialization prefix

> `readonly` **Invalid serialization prefix**: `129` = `129`

#### Invalid source address in outbound message

> `readonly` **Invalid source address in outbound message**: `35` = `35`

#### Invalid standard address

> `readonly` **Invalid standard address**: `136` = `136`

#### Library change action error

> `readonly` **Library change action error**: `42` = `42`

#### Library reference is null

> `readonly` **Library reference is null**: `41` = `41`

#### Not enough extra currencies

> `readonly` **Not enough extra currencies**: `38` = `38`

#### Not enough Toncoin

> `readonly` **Not enough Toncoin**: `37` = `37`

#### Null reference exception

> `readonly` **Null reference exception**: `128` = `128`

#### Out of gas error

> `readonly` **Out of gas error**: `13` = `13`

#### Outbound message does not fit into a cell after rewriting

> `readonly` **Outbound message does not fit into a cell after rewriting**: `39` = `39`

#### Stack overflow

> `readonly` **Stack overflow**: `3` = `3`

#### Stack underflow

> `readonly` **Stack underflow**: `2` = `2`

#### Type check error

> `readonly` **Type check error**: `7` = `7`

#### Virtualization error

> `readonly` **Virtualization error**: `14` = `14`

***

### opcodes

> `readonly` `static` **opcodes**: `object` = `PoolFactory_opcodes`

Defined in: [contracts/tact\_PoolFactory.ts:2103](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2103)

#### ChangeCodes

> **ChangeCodes**: `number` = `4125036946`

#### ChangeFees

> **ChangeFees**: `number` = `3429681529`

#### ChangeOwner

> **ChangeOwner**: `number` = `2174598809`

#### ChangeOwnerOk

> **ChangeOwnerOk**: `number` = `846932810`

#### Deploy

> **Deploy**: `number` = `2490013878`

#### DeployOk

> **DeployOk**: `number` = `2952335191`

#### DeployPoolMsg

> **DeployPoolMsg**: `number` = `4255566396`

#### FactoryDeploy

> **FactoryDeploy**: `number` = `1829761339`

#### GetterPoolAddress

> **GetterPoolAddress**: `number` = `497623280`

#### GetterPoolAddressAnswer

> **GetterPoolAddressAnswer**: `number` = `2188725937`

#### VanityDeployMsg

> **VanityDeployMsg**: `number` = `3088368666`

***

### storageReserve

> `readonly` `static` **storageReserve**: `0n` = `0n`

Defined in: [contracts/tact\_PoolFactory.ts:2101](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2101)

## Methods

### getFees()

> **getFees**(`provider`): `Promise`\<\{ `$$type`: `"FeesData"`; `protocol_fee`: `bigint`; `ref_fee`: `bigint`; \}\>

Defined in: [contracts/tact\_PoolFactory.ts:2235](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2235)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<\{ `$$type`: `"FeesData"`; `protocol_fee`: `bigint`; `ref_fee`: `bigint`; \}\>

***

### getGetPoolAddress()

> **getGetPoolAddress**(`provider`, `deployer`, `seed`): `Promise`\<`Address`\>

Defined in: [contracts/tact\_PoolFactory.ts:2226](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2226)

#### Parameters

##### provider

`ContractProvider`

##### deployer

`Address`

##### seed

`Cell`

#### Returns

`Promise`\<`Address`\>

***

### getOwner()

> **getOwner**(`provider`): `Promise`\<`Address`\>

Defined in: [contracts/tact\_PoolFactory.ts:2242](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2242)

#### Parameters

##### provider

`ContractProvider`

#### Returns

`Promise`\<`Address`\>

***

### send()

> **send**(`provider`, `via`, `args`, `message`): `Promise`\<`void`\>

Defined in: [contracts/tact\_PoolFactory.ts:2169](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2169)

#### Parameters

##### provider

`ContractProvider`

##### via

`Sender`

##### args

###### bounce?

`null` \| `boolean`

###### value

`bigint`

##### message

`null` | `ChangeOwner` | `DeployPoolMsg` | `GetterPoolAddress` | `ChangeCodes` | `ChangeFees`

#### Returns

`Promise`\<`void`\>

***

### fromAddress()

> `static` **fromAddress**(`address`): `PoolFactory`

Defined in: [contracts/tact\_PoolFactory.ts:2151](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2151)

#### Parameters

##### address

`Address`

#### Returns

`PoolFactory`

***

### fromInit()

> `static` **fromInit**(`owner`, `pool_code`, `range_code`, `multitoken_code`, `trade_account_code`, `lp_account_code`, `protocol_fee`, `ref_fee`): `Promise`\<`PoolFactory`\>

Defined in: [contracts/tact\_PoolFactory.ts:2127](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2127)

#### Parameters

##### owner

`Address`

##### pool\_code

`Cell`

##### range\_code

`Cell`

##### multitoken\_code

`Cell`

##### trade\_account\_code

`Cell`

##### lp\_account\_code

`Cell`

##### protocol\_fee

`bigint`

##### ref\_fee

`bigint`

#### Returns

`Promise`\<`PoolFactory`\>

***

### init()

> `static` **init**(`owner`, `pool_code`, `range_code`, `multitoken_code`, `trade_account_code`, `lp_account_code`, `protocol_fee`, `ref_fee`): `Promise`\<\{ `code`: `Cell`; `data`: `Cell`; \}\>

Defined in: [contracts/tact\_PoolFactory.ts:2105](https://github.com/bidask-protocol/bidask-sdk/blob/545ce6f0b69b63e9adb5d1887eecab168c52c07d/packages/sdk/src/contracts/tact_PoolFactory.ts#L2105)

#### Parameters

##### owner

`Address`

##### pool\_code

`Cell`

##### range\_code

`Cell`

##### multitoken\_code

`Cell`

##### trade\_account\_code

`Cell`

##### lp\_account\_code

`Cell`

##### protocol\_fee

`bigint`

##### ref\_fee

`bigint`

#### Returns

`Promise`\<\{ `code`: `Cell`; `data`: `Cell`; \}\>
