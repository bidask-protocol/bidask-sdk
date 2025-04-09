import {
  ABIGetter,
  ABIReceiver,
  ABIType,
  Address,
  address,
  beginCell,
  Builder,
  Cell,
  ComputeError,
  Contract,
  ContractABI,
  contractAddress,
  ContractProvider,
  Dictionary,
  DictionaryValue,
  Sender,
  Slice,
  TupleBuilder,
  TupleItem,
  TupleReader,
} from '@ton/ton'

export type DataSize = {
  $$type: 'DataSize'
  cells: bigint
  bits: bigint
  refs: bigint
}

export function storeDataSize(src: DataSize) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.cells, 257)
    b_0.storeInt(src.bits, 257)
    b_0.storeInt(src.refs, 257)
  }
}

export function loadDataSize(slice: Slice) {
  const sc_0 = slice
  const _cells = sc_0.loadIntBig(257)
  const _bits = sc_0.loadIntBig(257)
  const _refs = sc_0.loadIntBig(257)
  return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs }
}

function loadTupleDataSize(source: TupleReader) {
  const _cells = source.readBigNumber()
  const _bits = source.readBigNumber()
  const _refs = source.readBigNumber()
  return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs }
}

function loadGetterTupleDataSize(source: TupleReader) {
  const _cells = source.readBigNumber()
  const _bits = source.readBigNumber()
  const _refs = source.readBigNumber()
  return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs }
}

function storeTupleDataSize(source: DataSize) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.cells)
  builder.writeNumber(source.bits)
  builder.writeNumber(source.refs)
  return builder.build()
}

function dictValueParserDataSize(): DictionaryValue<DataSize> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDataSize(src)).endCell())
    },
    parse: (src) => {
      return loadDataSize(src.loadRef().beginParse())
    },
  }
}

export type StateInit = {
  $$type: 'StateInit'
  code: Cell
  data: Cell
}

export function storeStateInit(src: StateInit) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeRef(src.code)
    b_0.storeRef(src.data)
  }
}

export function loadStateInit(slice: Slice) {
  const sc_0 = slice
  const _code = sc_0.loadRef()
  const _data = sc_0.loadRef()
  return { $$type: 'StateInit' as const, code: _code, data: _data }
}

function loadTupleStateInit(source: TupleReader) {
  const _code = source.readCell()
  const _data = source.readCell()
  return { $$type: 'StateInit' as const, code: _code, data: _data }
}

function loadGetterTupleStateInit(source: TupleReader) {
  const _code = source.readCell()
  const _data = source.readCell()
  return { $$type: 'StateInit' as const, code: _code, data: _data }
}

function storeTupleStateInit(source: StateInit) {
  const builder = new TupleBuilder()
  builder.writeCell(source.code)
  builder.writeCell(source.data)
  return builder.build()
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStateInit(src)).endCell())
    },
    parse: (src) => {
      return loadStateInit(src.loadRef().beginParse())
    },
  }
}

export type Context = {
  $$type: 'Context'
  bounceable: boolean
  sender: Address
  value: bigint
  raw: Slice
}

export function storeContext(src: Context) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeBit(src.bounceable)
    b_0.storeAddress(src.sender)
    b_0.storeInt(src.value, 257)
    b_0.storeRef(src.raw.asCell())
  }
}

export function loadContext(slice: Slice) {
  const sc_0 = slice
  const _bounceable = sc_0.loadBit()
  const _sender = sc_0.loadAddress()
  const _value = sc_0.loadIntBig(257)
  const _raw = sc_0.loadRef().asSlice()
  return {
    $$type: 'Context' as const,
    bounceable: _bounceable,
    sender: _sender,
    value: _value,
    raw: _raw,
  }
}

function loadTupleContext(source: TupleReader) {
  const _bounceable = source.readBoolean()
  const _sender = source.readAddress()
  const _value = source.readBigNumber()
  const _raw = source.readCell().asSlice()
  return {
    $$type: 'Context' as const,
    bounceable: _bounceable,
    sender: _sender,
    value: _value,
    raw: _raw,
  }
}

function loadGetterTupleContext(source: TupleReader) {
  const _bounceable = source.readBoolean()
  const _sender = source.readAddress()
  const _value = source.readBigNumber()
  const _raw = source.readCell().asSlice()
  return {
    $$type: 'Context' as const,
    bounceable: _bounceable,
    sender: _sender,
    value: _value,
    raw: _raw,
  }
}

function storeTupleContext(source: Context) {
  const builder = new TupleBuilder()
  builder.writeBoolean(source.bounceable)
  builder.writeAddress(source.sender)
  builder.writeNumber(source.value)
  builder.writeSlice(source.raw.asCell())
  return builder.build()
}

function dictValueParserContext(): DictionaryValue<Context> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeContext(src)).endCell())
    },
    parse: (src) => {
      return loadContext(src.loadRef().beginParse())
    },
  }
}

export type SendParameters = {
  $$type: 'SendParameters'
  mode: bigint
  body: Cell | null
  code: Cell | null
  data: Cell | null
  value: bigint
  to: Address
  bounce: boolean
}

export function storeSendParameters(src: SendParameters) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.mode, 257)
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body)
    } else {
      b_0.storeBit(false)
    }
    if (src.code !== null && src.code !== undefined) {
      b_0.storeBit(true).storeRef(src.code)
    } else {
      b_0.storeBit(false)
    }
    if (src.data !== null && src.data !== undefined) {
      b_0.storeBit(true).storeRef(src.data)
    } else {
      b_0.storeBit(false)
    }
    b_0.storeInt(src.value, 257)
    b_0.storeAddress(src.to)
    b_0.storeBit(src.bounce)
  }
}

export function loadSendParameters(slice: Slice) {
  const sc_0 = slice
  const _mode = sc_0.loadIntBig(257)
  const _body = sc_0.loadBit() ? sc_0.loadRef() : null
  const _code = sc_0.loadBit() ? sc_0.loadRef() : null
  const _data = sc_0.loadBit() ? sc_0.loadRef() : null
  const _value = sc_0.loadIntBig(257)
  const _to = sc_0.loadAddress()
  const _bounce = sc_0.loadBit()
  return {
    $$type: 'SendParameters' as const,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
    value: _value,
    to: _to,
    bounce: _bounce,
  }
}

function loadTupleSendParameters(source: TupleReader) {
  const _mode = source.readBigNumber()
  const _body = source.readCellOpt()
  const _code = source.readCellOpt()
  const _data = source.readCellOpt()
  const _value = source.readBigNumber()
  const _to = source.readAddress()
  const _bounce = source.readBoolean()
  return {
    $$type: 'SendParameters' as const,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
    value: _value,
    to: _to,
    bounce: _bounce,
  }
}

function loadGetterTupleSendParameters(source: TupleReader) {
  const _mode = source.readBigNumber()
  const _body = source.readCellOpt()
  const _code = source.readCellOpt()
  const _data = source.readCellOpt()
  const _value = source.readBigNumber()
  const _to = source.readAddress()
  const _bounce = source.readBoolean()
  return {
    $$type: 'SendParameters' as const,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
    value: _value,
    to: _to,
    bounce: _bounce,
  }
}

function storeTupleSendParameters(source: SendParameters) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.mode)
  builder.writeCell(source.body)
  builder.writeCell(source.code)
  builder.writeCell(source.data)
  builder.writeNumber(source.value)
  builder.writeAddress(source.to)
  builder.writeBoolean(source.bounce)
  return builder.build()
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSendParameters(src)).endCell())
    },
    parse: (src) => {
      return loadSendParameters(src.loadRef().beginParse())
    },
  }
}

export type MessageParameters = {
  $$type: 'MessageParameters'
  mode: bigint
  body: Cell | null
  value: bigint
  to: Address
  bounce: boolean
}

export function storeMessageParameters(src: MessageParameters) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.mode, 257)
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body)
    } else {
      b_0.storeBit(false)
    }
    b_0.storeInt(src.value, 257)
    b_0.storeAddress(src.to)
    b_0.storeBit(src.bounce)
  }
}

export function loadMessageParameters(slice: Slice) {
  const sc_0 = slice
  const _mode = sc_0.loadIntBig(257)
  const _body = sc_0.loadBit() ? sc_0.loadRef() : null
  const _value = sc_0.loadIntBig(257)
  const _to = sc_0.loadAddress()
  const _bounce = sc_0.loadBit()
  return {
    $$type: 'MessageParameters' as const,
    mode: _mode,
    body: _body,
    value: _value,
    to: _to,
    bounce: _bounce,
  }
}

function loadTupleMessageParameters(source: TupleReader) {
  const _mode = source.readBigNumber()
  const _body = source.readCellOpt()
  const _value = source.readBigNumber()
  const _to = source.readAddress()
  const _bounce = source.readBoolean()
  return {
    $$type: 'MessageParameters' as const,
    mode: _mode,
    body: _body,
    value: _value,
    to: _to,
    bounce: _bounce,
  }
}

function loadGetterTupleMessageParameters(source: TupleReader) {
  const _mode = source.readBigNumber()
  const _body = source.readCellOpt()
  const _value = source.readBigNumber()
  const _to = source.readAddress()
  const _bounce = source.readBoolean()
  return {
    $$type: 'MessageParameters' as const,
    mode: _mode,
    body: _body,
    value: _value,
    to: _to,
    bounce: _bounce,
  }
}

function storeTupleMessageParameters(source: MessageParameters) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.mode)
  builder.writeCell(source.body)
  builder.writeNumber(source.value)
  builder.writeAddress(source.to)
  builder.writeBoolean(source.bounce)
  return builder.build()
}

function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell())
    },
    parse: (src) => {
      return loadMessageParameters(src.loadRef().beginParse())
    },
  }
}

export type DeployParameters = {
  $$type: 'DeployParameters'
  mode: bigint
  body: Cell | null
  value: bigint
  bounce: boolean
  init: StateInit
}

export function storeDeployParameters(src: DeployParameters) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.mode, 257)
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body)
    } else {
      b_0.storeBit(false)
    }
    b_0.storeInt(src.value, 257)
    b_0.storeBit(src.bounce)
    b_0.store(storeStateInit(src.init))
  }
}

export function loadDeployParameters(slice: Slice) {
  const sc_0 = slice
  const _mode = sc_0.loadIntBig(257)
  const _body = sc_0.loadBit() ? sc_0.loadRef() : null
  const _value = sc_0.loadIntBig(257)
  const _bounce = sc_0.loadBit()
  const _init = loadStateInit(sc_0)
  return {
    $$type: 'DeployParameters' as const,
    mode: _mode,
    body: _body,
    value: _value,
    bounce: _bounce,
    init: _init,
  }
}

function loadTupleDeployParameters(source: TupleReader) {
  const _mode = source.readBigNumber()
  const _body = source.readCellOpt()
  const _value = source.readBigNumber()
  const _bounce = source.readBoolean()
  const _init = loadTupleStateInit(source)
  return {
    $$type: 'DeployParameters' as const,
    mode: _mode,
    body: _body,
    value: _value,
    bounce: _bounce,
    init: _init,
  }
}

function loadGetterTupleDeployParameters(source: TupleReader) {
  const _mode = source.readBigNumber()
  const _body = source.readCellOpt()
  const _value = source.readBigNumber()
  const _bounce = source.readBoolean()
  const _init = loadGetterTupleStateInit(source)
  return {
    $$type: 'DeployParameters' as const,
    mode: _mode,
    body: _body,
    value: _value,
    bounce: _bounce,
    init: _init,
  }
}

function storeTupleDeployParameters(source: DeployParameters) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.mode)
  builder.writeCell(source.body)
  builder.writeNumber(source.value)
  builder.writeBoolean(source.bounce)
  builder.writeTuple(storeTupleStateInit(source.init))
  return builder.build()
}

function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell())
    },
    parse: (src) => {
      return loadDeployParameters(src.loadRef().beginParse())
    },
  }
}

export type StdAddress = {
  $$type: 'StdAddress'
  workchain: bigint
  address: bigint
}

export function storeStdAddress(src: StdAddress) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.workchain, 8)
    b_0.storeUint(src.address, 256)
  }
}

export function loadStdAddress(slice: Slice) {
  const sc_0 = slice
  const _workchain = sc_0.loadIntBig(8)
  const _address = sc_0.loadUintBig(256)
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address }
}

function loadTupleStdAddress(source: TupleReader) {
  const _workchain = source.readBigNumber()
  const _address = source.readBigNumber()
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address }
}

function loadGetterTupleStdAddress(source: TupleReader) {
  const _workchain = source.readBigNumber()
  const _address = source.readBigNumber()
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address }
}

function storeTupleStdAddress(source: StdAddress) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.workchain)
  builder.writeNumber(source.address)
  return builder.build()
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStdAddress(src)).endCell())
    },
    parse: (src) => {
      return loadStdAddress(src.loadRef().beginParse())
    },
  }
}

export type VarAddress = {
  $$type: 'VarAddress'
  workchain: bigint
  address: Slice
}

export function storeVarAddress(src: VarAddress) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.workchain, 32)
    b_0.storeRef(src.address.asCell())
  }
}

export function loadVarAddress(slice: Slice) {
  const sc_0 = slice
  const _workchain = sc_0.loadIntBig(32)
  const _address = sc_0.loadRef().asSlice()
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address }
}

function loadTupleVarAddress(source: TupleReader) {
  const _workchain = source.readBigNumber()
  const _address = source.readCell().asSlice()
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address }
}

function loadGetterTupleVarAddress(source: TupleReader) {
  const _workchain = source.readBigNumber()
  const _address = source.readCell().asSlice()
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address }
}

function storeTupleVarAddress(source: VarAddress) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.workchain)
  builder.writeSlice(source.address.asCell())
  return builder.build()
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeVarAddress(src)).endCell())
    },
    parse: (src) => {
      return loadVarAddress(src.loadRef().beginParse())
    },
  }
}

export type BasechainAddress = {
  $$type: 'BasechainAddress'
  hash: bigint | null
}

export function storeBasechainAddress(src: BasechainAddress) {
  return (builder: Builder) => {
    const b_0 = builder
    if (src.hash !== null && src.hash !== undefined) {
      b_0.storeBit(true).storeInt(src.hash, 257)
    } else {
      b_0.storeBit(false)
    }
  }
}

export function loadBasechainAddress(slice: Slice) {
  const sc_0 = slice
  const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null
  return { $$type: 'BasechainAddress' as const, hash: _hash }
}

function loadTupleBasechainAddress(source: TupleReader) {
  const _hash = source.readBigNumberOpt()
  return { $$type: 'BasechainAddress' as const, hash: _hash }
}

function loadGetterTupleBasechainAddress(source: TupleReader) {
  const _hash = source.readBigNumberOpt()
  return { $$type: 'BasechainAddress' as const, hash: _hash }
}

function storeTupleBasechainAddress(source: BasechainAddress) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.hash)
  return builder.build()
}

function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell())
    },
    parse: (src) => {
      return loadBasechainAddress(src.loadRef().beginParse())
    },
  }
}

export type Deploy = {
  $$type: 'Deploy'
  queryId: bigint
}

export function storeDeploy(src: Deploy) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(2490013878, 32)
    b_0.storeUint(src.queryId, 64)
  }
}

export function loadDeploy(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 2490013878) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  return { $$type: 'Deploy' as const, queryId: _queryId }
}

function loadTupleDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber()
  return { $$type: 'Deploy' as const, queryId: _queryId }
}

function loadGetterTupleDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber()
  return { $$type: 'Deploy' as const, queryId: _queryId }
}

function storeTupleDeploy(source: Deploy) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  return builder.build()
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeploy(src)).endCell())
    },
    parse: (src) => {
      return loadDeploy(src.loadRef().beginParse())
    },
  }
}

export type DeployOk = {
  $$type: 'DeployOk'
  queryId: bigint
}

export function storeDeployOk(src: DeployOk) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(2952335191, 32)
    b_0.storeUint(src.queryId, 64)
  }
}

export function loadDeployOk(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 2952335191) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  return { $$type: 'DeployOk' as const, queryId: _queryId }
}

function loadTupleDeployOk(source: TupleReader) {
  const _queryId = source.readBigNumber()
  return { $$type: 'DeployOk' as const, queryId: _queryId }
}

function loadGetterTupleDeployOk(source: TupleReader) {
  const _queryId = source.readBigNumber()
  return { $$type: 'DeployOk' as const, queryId: _queryId }
}

function storeTupleDeployOk(source: DeployOk) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  return builder.build()
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeployOk(src)).endCell())
    },
    parse: (src) => {
      return loadDeployOk(src.loadRef().beginParse())
    },
  }
}

export type FactoryDeploy = {
  $$type: 'FactoryDeploy'
  queryId: bigint
  cashback: Address
}

export function storeFactoryDeploy(src: FactoryDeploy) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(1829761339, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeAddress(src.cashback)
  }
}

export function loadFactoryDeploy(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 1829761339) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _cashback = sc_0.loadAddress()
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback }
}

function loadTupleFactoryDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _cashback = source.readAddress()
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback }
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _cashback = source.readAddress()
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback }
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeAddress(source.cashback)
  return builder.build()
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell())
    },
    parse: (src) => {
      return loadFactoryDeploy(src.loadRef().beginParse())
    },
  }
}

export type ChangeOwner = {
  $$type: 'ChangeOwner'
  queryId: bigint
  newOwner: Address
}

export function storeChangeOwner(src: ChangeOwner) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(2174598809, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeAddress(src.newOwner)
  }
}

export function loadChangeOwner(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 2174598809) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _newOwner = sc_0.loadAddress()
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner }
}

function loadTupleChangeOwner(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _newOwner = source.readAddress()
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner }
}

function loadGetterTupleChangeOwner(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _newOwner = source.readAddress()
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner }
}

function storeTupleChangeOwner(source: ChangeOwner) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeAddress(source.newOwner)
  return builder.build()
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell())
    },
    parse: (src) => {
      return loadChangeOwner(src.loadRef().beginParse())
    },
  }
}

export type ChangeOwnerOk = {
  $$type: 'ChangeOwnerOk'
  queryId: bigint
  newOwner: Address
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(846932810, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeAddress(src.newOwner)
  }
}

export function loadChangeOwnerOk(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 846932810) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _newOwner = sc_0.loadAddress()
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner }
}

function loadTupleChangeOwnerOk(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _newOwner = source.readAddress()
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner }
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _newOwner = source.readAddress()
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner }
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeAddress(source.newOwner)
  return builder.build()
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell())
    },
    parse: (src) => {
      return loadChangeOwnerOk(src.loadRef().beginParse())
    },
  }
}

export type DeployPoolMsg = {
  $$type: 'DeployPoolMsg'
  queryId: bigint
  seed: Cell
  token1: Address
  token2: Address
  bin_step: bigint
  lp_fee: bigint
  init_bin: bigint
  init_sqrt_p: bigint
}

export function storeDeployPoolMsg(src: DeployPoolMsg) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(4255566396, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeRef(src.seed)
    b_0.storeAddress(src.token1)
    b_0.storeAddress(src.token2)
    b_0.storeUint(src.bin_step, 32)
    b_0.storeUint(src.lp_fee, 16)
    b_0.storeInt(src.init_bin, 32)
    b_0.storeUint(src.init_sqrt_p, 256)
  }
}

export function loadDeployPoolMsg(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 4255566396) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _seed = sc_0.loadRef()
  const _token1 = sc_0.loadAddress()
  const _token2 = sc_0.loadAddress()
  const _bin_step = sc_0.loadUintBig(32)
  const _lp_fee = sc_0.loadUintBig(16)
  const _init_bin = sc_0.loadIntBig(32)
  const _init_sqrt_p = sc_0.loadUintBig(256)
  return {
    $$type: 'DeployPoolMsg' as const,
    queryId: _queryId,
    seed: _seed,
    token1: _token1,
    token2: _token2,
    bin_step: _bin_step,
    lp_fee: _lp_fee,
    init_bin: _init_bin,
    init_sqrt_p: _init_sqrt_p,
  }
}

function loadTupleDeployPoolMsg(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _seed = source.readCell()
  const _token1 = source.readAddress()
  const _token2 = source.readAddress()
  const _bin_step = source.readBigNumber()
  const _lp_fee = source.readBigNumber()
  const _init_bin = source.readBigNumber()
  const _init_sqrt_p = source.readBigNumber()
  return {
    $$type: 'DeployPoolMsg' as const,
    queryId: _queryId,
    seed: _seed,
    token1: _token1,
    token2: _token2,
    bin_step: _bin_step,
    lp_fee: _lp_fee,
    init_bin: _init_bin,
    init_sqrt_p: _init_sqrt_p,
  }
}

function loadGetterTupleDeployPoolMsg(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _seed = source.readCell()
  const _token1 = source.readAddress()
  const _token2 = source.readAddress()
  const _bin_step = source.readBigNumber()
  const _lp_fee = source.readBigNumber()
  const _init_bin = source.readBigNumber()
  const _init_sqrt_p = source.readBigNumber()
  return {
    $$type: 'DeployPoolMsg' as const,
    queryId: _queryId,
    seed: _seed,
    token1: _token1,
    token2: _token2,
    bin_step: _bin_step,
    lp_fee: _lp_fee,
    init_bin: _init_bin,
    init_sqrt_p: _init_sqrt_p,
  }
}

function storeTupleDeployPoolMsg(source: DeployPoolMsg) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeCell(source.seed)
  builder.writeAddress(source.token1)
  builder.writeAddress(source.token2)
  builder.writeNumber(source.bin_step)
  builder.writeNumber(source.lp_fee)
  builder.writeNumber(source.init_bin)
  builder.writeNumber(source.init_sqrt_p)
  return builder.build()
}

function dictValueParserDeployPoolMsg(): DictionaryValue<DeployPoolMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeployPoolMsg(src)).endCell())
    },
    parse: (src) => {
      return loadDeployPoolMsg(src.loadRef().beginParse())
    },
  }
}

export type GetterPoolAddress = {
  $$type: 'GetterPoolAddress'
  queryId: bigint
  seed: Cell
  forward_payload: Cell | null
}

export function storeGetterPoolAddress(src: GetterPoolAddress) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(497623280, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeRef(src.seed)
    if (src.forward_payload !== null && src.forward_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.forward_payload)
    } else {
      b_0.storeBit(false)
    }
  }
}

export function loadGetterPoolAddress(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 497623280) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _seed = sc_0.loadRef()
  const _forward_payload = sc_0.loadBit() ? sc_0.loadRef() : null
  return {
    $$type: 'GetterPoolAddress' as const,
    queryId: _queryId,
    seed: _seed,
    forward_payload: _forward_payload,
  }
}

function loadTupleGetterPoolAddress(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _seed = source.readCell()
  const _forward_payload = source.readCellOpt()
  return {
    $$type: 'GetterPoolAddress' as const,
    queryId: _queryId,
    seed: _seed,
    forward_payload: _forward_payload,
  }
}

function loadGetterTupleGetterPoolAddress(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _seed = source.readCell()
  const _forward_payload = source.readCellOpt()
  return {
    $$type: 'GetterPoolAddress' as const,
    queryId: _queryId,
    seed: _seed,
    forward_payload: _forward_payload,
  }
}

function storeTupleGetterPoolAddress(source: GetterPoolAddress) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeCell(source.seed)
  builder.writeCell(source.forward_payload)
  return builder.build()
}

function dictValueParserGetterPoolAddress(): DictionaryValue<GetterPoolAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGetterPoolAddress(src)).endCell())
    },
    parse: (src) => {
      return loadGetterPoolAddress(src.loadRef().beginParse())
    },
  }
}

export type GetterPoolAddressAnswer = {
  $$type: 'GetterPoolAddressAnswer'
  queryId: bigint
  pool_address: Address
  forward_payload: Cell | null
}

export function storeGetterPoolAddressAnswer(src: GetterPoolAddressAnswer) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(2188725937, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeAddress(src.pool_address)
    if (src.forward_payload !== null && src.forward_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.forward_payload)
    } else {
      b_0.storeBit(false)
    }
  }
}

export function loadGetterPoolAddressAnswer(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 2188725937) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _pool_address = sc_0.loadAddress()
  const _forward_payload = sc_0.loadBit() ? sc_0.loadRef() : null
  return {
    $$type: 'GetterPoolAddressAnswer' as const,
    queryId: _queryId,
    pool_address: _pool_address,
    forward_payload: _forward_payload,
  }
}

function loadTupleGetterPoolAddressAnswer(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _pool_address = source.readAddress()
  const _forward_payload = source.readCellOpt()
  return {
    $$type: 'GetterPoolAddressAnswer' as const,
    queryId: _queryId,
    pool_address: _pool_address,
    forward_payload: _forward_payload,
  }
}

function loadGetterTupleGetterPoolAddressAnswer(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _pool_address = source.readAddress()
  const _forward_payload = source.readCellOpt()
  return {
    $$type: 'GetterPoolAddressAnswer' as const,
    queryId: _queryId,
    pool_address: _pool_address,
    forward_payload: _forward_payload,
  }
}

function storeTupleGetterPoolAddressAnswer(source: GetterPoolAddressAnswer) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeAddress(source.pool_address)
  builder.writeCell(source.forward_payload)
  return builder.build()
}

function dictValueParserGetterPoolAddressAnswer(): DictionaryValue<GetterPoolAddressAnswer> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeGetterPoolAddressAnswer(src)).endCell())
    },
    parse: (src) => {
      return loadGetterPoolAddressAnswer(src.loadRef().beginParse())
    },
  }
}

export type ChangeCodes = {
  $$type: 'ChangeCodes'
  queryId: bigint
  pool_code: Cell
  range_code: Cell
  multitoken_code: Cell
  trade_account_code: Cell
  lp_account_code: Cell
}

export function storeChangeCodes(src: ChangeCodes) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(4125036946, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeRef(src.pool_code)
    b_0.storeRef(src.range_code)
    const b_1 = new Builder()
    b_1.storeRef(src.multitoken_code)
    b_1.storeRef(src.trade_account_code)
    b_1.storeRef(src.lp_account_code)
    b_0.storeRef(b_1.endCell())
  }
}

export function loadChangeCodes(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 4125036946) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _pool_code = sc_0.loadRef()
  const _range_code = sc_0.loadRef()
  const sc_1 = sc_0.loadRef().beginParse()
  const _multitoken_code = sc_1.loadRef()
  const _trade_account_code = sc_1.loadRef()
  const _lp_account_code = sc_1.loadRef()
  return {
    $$type: 'ChangeCodes' as const,
    queryId: _queryId,
    pool_code: _pool_code,
    range_code: _range_code,
    multitoken_code: _multitoken_code,
    trade_account_code: _trade_account_code,
    lp_account_code: _lp_account_code,
  }
}

function loadTupleChangeCodes(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _pool_code = source.readCell()
  const _range_code = source.readCell()
  const _multitoken_code = source.readCell()
  const _trade_account_code = source.readCell()
  const _lp_account_code = source.readCell()
  return {
    $$type: 'ChangeCodes' as const,
    queryId: _queryId,
    pool_code: _pool_code,
    range_code: _range_code,
    multitoken_code: _multitoken_code,
    trade_account_code: _trade_account_code,
    lp_account_code: _lp_account_code,
  }
}

function loadGetterTupleChangeCodes(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _pool_code = source.readCell()
  const _range_code = source.readCell()
  const _multitoken_code = source.readCell()
  const _trade_account_code = source.readCell()
  const _lp_account_code = source.readCell()
  return {
    $$type: 'ChangeCodes' as const,
    queryId: _queryId,
    pool_code: _pool_code,
    range_code: _range_code,
    multitoken_code: _multitoken_code,
    trade_account_code: _trade_account_code,
    lp_account_code: _lp_account_code,
  }
}

function storeTupleChangeCodes(source: ChangeCodes) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeCell(source.pool_code)
  builder.writeCell(source.range_code)
  builder.writeCell(source.multitoken_code)
  builder.writeCell(source.trade_account_code)
  builder.writeCell(source.lp_account_code)
  return builder.build()
}

function dictValueParserChangeCodes(): DictionaryValue<ChangeCodes> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeCodes(src)).endCell())
    },
    parse: (src) => {
      return loadChangeCodes(src.loadRef().beginParse())
    },
  }
}

export type ChangeFees = {
  $$type: 'ChangeFees'
  queryId: bigint
  protocol_fee: bigint
  ref_fee: bigint
}

export function storeChangeFees(src: ChangeFees) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(3429681529, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeUint(src.protocol_fee, 16)
    b_0.storeUint(src.ref_fee, 16)
  }
}

export function loadChangeFees(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 3429681529) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _protocol_fee = sc_0.loadUintBig(16)
  const _ref_fee = sc_0.loadUintBig(16)
  return {
    $$type: 'ChangeFees' as const,
    queryId: _queryId,
    protocol_fee: _protocol_fee,
    ref_fee: _ref_fee,
  }
}

function loadTupleChangeFees(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _protocol_fee = source.readBigNumber()
  const _ref_fee = source.readBigNumber()
  return {
    $$type: 'ChangeFees' as const,
    queryId: _queryId,
    protocol_fee: _protocol_fee,
    ref_fee: _ref_fee,
  }
}

function loadGetterTupleChangeFees(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _protocol_fee = source.readBigNumber()
  const _ref_fee = source.readBigNumber()
  return {
    $$type: 'ChangeFees' as const,
    queryId: _queryId,
    protocol_fee: _protocol_fee,
    ref_fee: _ref_fee,
  }
}

function storeTupleChangeFees(source: ChangeFees) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeNumber(source.protocol_fee)
  builder.writeNumber(source.ref_fee)
  return builder.build()
}

function dictValueParserChangeFees(): DictionaryValue<ChangeFees> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeFees(src)).endCell())
    },
    parse: (src) => {
      return loadChangeFees(src.loadRef().beginParse())
    },
  }
}

export type FeesData = {
  $$type: 'FeesData'
  protocol_fee: bigint
  ref_fee: bigint
}

export function storeFeesData(src: FeesData) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeInt(src.protocol_fee, 257)
    b_0.storeInt(src.ref_fee, 257)
  }
}

export function loadFeesData(slice: Slice) {
  const sc_0 = slice
  const _protocol_fee = sc_0.loadIntBig(257)
  const _ref_fee = sc_0.loadIntBig(257)
  return { $$type: 'FeesData' as const, protocol_fee: _protocol_fee, ref_fee: _ref_fee }
}

function loadTupleFeesData(source: TupleReader) {
  const _protocol_fee = source.readBigNumber()
  const _ref_fee = source.readBigNumber()
  return { $$type: 'FeesData' as const, protocol_fee: _protocol_fee, ref_fee: _ref_fee }
}

function loadGetterTupleFeesData(source: TupleReader) {
  const _protocol_fee = source.readBigNumber()
  const _ref_fee = source.readBigNumber()
  return { $$type: 'FeesData' as const, protocol_fee: _protocol_fee, ref_fee: _ref_fee }
}

function storeTupleFeesData(source: FeesData) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.protocol_fee)
  builder.writeNumber(source.ref_fee)
  return builder.build()
}

function dictValueParserFeesData(): DictionaryValue<FeesData> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFeesData(src)).endCell())
    },
    parse: (src) => {
      return loadFeesData(src.loadRef().beginParse())
    },
  }
}

export type VanityDeployMsg = {
  $$type: 'VanityDeployMsg'
  queryId: bigint
  new_data: Cell
  new_code: Cell
}

export function storeVanityDeployMsg(src: VanityDeployMsg) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeUint(3088368666, 32)
    b_0.storeUint(src.queryId, 64)
    b_0.storeRef(src.new_data)
    b_0.storeRef(src.new_code)
  }
}

export function loadVanityDeployMsg(slice: Slice) {
  const sc_0 = slice
  if (sc_0.loadUint(32) !== 3088368666) {
    throw Error('Invalid prefix')
  }
  const _queryId = sc_0.loadUintBig(64)
  const _new_data = sc_0.loadRef()
  const _new_code = sc_0.loadRef()
  return {
    $$type: 'VanityDeployMsg' as const,
    queryId: _queryId,
    new_data: _new_data,
    new_code: _new_code,
  }
}

function loadTupleVanityDeployMsg(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _new_data = source.readCell()
  const _new_code = source.readCell()
  return {
    $$type: 'VanityDeployMsg' as const,
    queryId: _queryId,
    new_data: _new_data,
    new_code: _new_code,
  }
}

function loadGetterTupleVanityDeployMsg(source: TupleReader) {
  const _queryId = source.readBigNumber()
  const _new_data = source.readCell()
  const _new_code = source.readCell()
  return {
    $$type: 'VanityDeployMsg' as const,
    queryId: _queryId,
    new_data: _new_data,
    new_code: _new_code,
  }
}

function storeTupleVanityDeployMsg(source: VanityDeployMsg) {
  const builder = new TupleBuilder()
  builder.writeNumber(source.queryId)
  builder.writeCell(source.new_data)
  builder.writeCell(source.new_code)
  return builder.build()
}

function dictValueParserVanityDeployMsg(): DictionaryValue<VanityDeployMsg> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeVanityDeployMsg(src)).endCell())
    },
    parse: (src) => {
      return loadVanityDeployMsg(src.loadRef().beginParse())
    },
  }
}

export type Vanity$Data = {
  $$type: 'Vanity$Data'
  owner: Address
  seed: Cell
}

export function storeVanity$Data(src: Vanity$Data) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeAddress(src.owner)
    b_0.storeRef(src.seed)
  }
}

export function loadVanity$Data(slice: Slice) {
  const sc_0 = slice
  const _owner = sc_0.loadAddress()
  const _seed = sc_0.loadRef()
  return { $$type: 'Vanity$Data' as const, owner: _owner, seed: _seed }
}

function loadTupleVanity$Data(source: TupleReader) {
  const _owner = source.readAddress()
  const _seed = source.readCell()
  return { $$type: 'Vanity$Data' as const, owner: _owner, seed: _seed }
}

function loadGetterTupleVanity$Data(source: TupleReader) {
  const _owner = source.readAddress()
  const _seed = source.readCell()
  return { $$type: 'Vanity$Data' as const, owner: _owner, seed: _seed }
}

function storeTupleVanity$Data(source: Vanity$Data) {
  const builder = new TupleBuilder()
  builder.writeAddress(source.owner)
  builder.writeCell(source.seed)
  return builder.build()
}

function dictValueParserVanity$Data(): DictionaryValue<Vanity$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeVanity$Data(src)).endCell())
    },
    parse: (src) => {
      return loadVanity$Data(src.loadRef().beginParse())
    },
  }
}

export type PoolFactory$Data = {
  $$type: 'PoolFactory$Data'
  owner: Address
  pool_code: Cell
  range_code: Cell
  multitoken_code: Cell
  trade_account_code: Cell
  lp_account_code: Cell
  protocol_fee: bigint
  ref_fee: bigint
}

export function storePoolFactory$Data(src: PoolFactory$Data) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeAddress(src.owner)
    b_0.storeRef(src.pool_code)
    b_0.storeRef(src.range_code)
    const b_1 = new Builder()
    b_1.storeRef(src.multitoken_code)
    b_1.storeRef(src.trade_account_code)
    b_1.storeRef(src.lp_account_code)
    b_1.storeInt(src.protocol_fee, 257)
    b_1.storeInt(src.ref_fee, 257)
    b_0.storeRef(b_1.endCell())
  }
}

export function loadPoolFactory$Data(slice: Slice) {
  const sc_0 = slice
  const _owner = sc_0.loadAddress()
  const _pool_code = sc_0.loadRef()
  const _range_code = sc_0.loadRef()
  const sc_1 = sc_0.loadRef().beginParse()
  const _multitoken_code = sc_1.loadRef()
  const _trade_account_code = sc_1.loadRef()
  const _lp_account_code = sc_1.loadRef()
  const _protocol_fee = sc_1.loadIntBig(257)
  const _ref_fee = sc_1.loadIntBig(257)
  return {
    $$type: 'PoolFactory$Data' as const,
    owner: _owner,
    pool_code: _pool_code,
    range_code: _range_code,
    multitoken_code: _multitoken_code,
    trade_account_code: _trade_account_code,
    lp_account_code: _lp_account_code,
    protocol_fee: _protocol_fee,
    ref_fee: _ref_fee,
  }
}

function loadTuplePoolFactory$Data(source: TupleReader) {
  const _owner = source.readAddress()
  const _pool_code = source.readCell()
  const _range_code = source.readCell()
  const _multitoken_code = source.readCell()
  const _trade_account_code = source.readCell()
  const _lp_account_code = source.readCell()
  const _protocol_fee = source.readBigNumber()
  const _ref_fee = source.readBigNumber()
  return {
    $$type: 'PoolFactory$Data' as const,
    owner: _owner,
    pool_code: _pool_code,
    range_code: _range_code,
    multitoken_code: _multitoken_code,
    trade_account_code: _trade_account_code,
    lp_account_code: _lp_account_code,
    protocol_fee: _protocol_fee,
    ref_fee: _ref_fee,
  }
}

function loadGetterTuplePoolFactory$Data(source: TupleReader) {
  const _owner = source.readAddress()
  const _pool_code = source.readCell()
  const _range_code = source.readCell()
  const _multitoken_code = source.readCell()
  const _trade_account_code = source.readCell()
  const _lp_account_code = source.readCell()
  const _protocol_fee = source.readBigNumber()
  const _ref_fee = source.readBigNumber()
  return {
    $$type: 'PoolFactory$Data' as const,
    owner: _owner,
    pool_code: _pool_code,
    range_code: _range_code,
    multitoken_code: _multitoken_code,
    trade_account_code: _trade_account_code,
    lp_account_code: _lp_account_code,
    protocol_fee: _protocol_fee,
    ref_fee: _ref_fee,
  }
}

function storeTuplePoolFactory$Data(source: PoolFactory$Data) {
  const builder = new TupleBuilder()
  builder.writeAddress(source.owner)
  builder.writeCell(source.pool_code)
  builder.writeCell(source.range_code)
  builder.writeCell(source.multitoken_code)
  builder.writeCell(source.trade_account_code)
  builder.writeCell(source.lp_account_code)
  builder.writeNumber(source.protocol_fee)
  builder.writeNumber(source.ref_fee)
  return builder.build()
}

function dictValueParserPoolFactory$Data(): DictionaryValue<PoolFactory$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storePoolFactory$Data(src)).endCell())
    },
    parse: (src) => {
      return loadPoolFactory$Data(src.loadRef().beginParse())
    },
  }
}

type PoolFactory_init_args = {
  $$type: 'PoolFactory_init_args'
  owner: Address
  pool_code: Cell
  range_code: Cell
  multitoken_code: Cell
  trade_account_code: Cell
  lp_account_code: Cell
  protocol_fee: bigint
  ref_fee: bigint
}

function initPoolFactory_init_args(src: PoolFactory_init_args) {
  return (builder: Builder) => {
    const b_0 = builder
    b_0.storeAddress(src.owner)
    b_0.storeRef(src.pool_code)
    const b_1 = new Builder()
    b_1.storeRef(src.range_code)
    b_1.storeRef(src.multitoken_code)
    b_1.storeRef(src.trade_account_code)
    b_1.storeRef(src.lp_account_code)
    b_1.storeInt(src.protocol_fee, 257)
    b_1.storeInt(src.ref_fee, 257)
    b_0.storeRef(b_1.endCell())
  }
}

async function PoolFactory_init(
  owner: Address,
  pool_code: Cell,
  range_code: Cell,
  multitoken_code: Cell,
  trade_account_code: Cell,
  lp_account_code: Cell,
  protocol_fee: bigint,
  ref_fee: bigint,
) {
  const __code = Cell.fromBase64(
    'te6ccgECGgEABT0AAh7/ACCOgTDh9KQT9LzyyAsBAgTcAdBy1yHSANIA+kAhEDRQZm8E+GEC+GLtRND6QNTUAdDU1NTUgQEB1wCBAQHXADAQaBBnbBgJkl8J4HAo10kgwh+VMQjTHwneIYIQ/abKPLrjAiGCEMxsyXm64wIhghD13xGSuuMCIYIQHakg8LoDBAUGAgJxDxAC/FsH0z/U+kD6QNMf0w/SH9P/VXA4J8AA8tU5+EFvJDBsEoILk4cAufLVOo0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCbHBfLVO4jIcAHLP40IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAcIAW5bB9M/0w/TD1UgbCJQids8WxBXVRTIVXBQh88WFcwDyMwSzMwSzBOBAQHPAIEBAc8AyQHMye1UCwGiWwfTP9TU1AHQ1NTUMBA2EDUQNDU1EHoQaRBYEEoQOUi82zxQVl8FECcQNhA1RADIVXBQh88WFcwDyMwSzMwSzBOBAQHPAIEBAc8AyQHMye1UCwPg4wIhghCBnb6Zuo9VWwfTP/pAWTJQids8N1GHyFmCEDJ7K0pQA8sfyz8BzxbJEHgQVxBGEDVEMBL4QgF/bds8yFVwUIfPFhXMA8jMEszMEswTgQEBzwCBAQHPAMkBzMntVOBQml8JwAABwSGw3PLAggoLDAAAAvrPFnAByz/MycgezBrMG8zJyHD6AnD6Ai7PFnD6AnD6AhjL/xnMychQDc8WGMsPHMsPHMsPUAvPFlAJzxYUyh9wAcsDEssfFczMzMlwgED4KMhQBs8WB9AXzxbJFIjIWlnPFszJRVPIVSCCELgUxBpQBMsfEss/zMzJECQQIxUJAIoDRBR/Al9B+QAB+QBa12UB12WCAgE0yMsXyw/LD8v/y/9x+QQAA8jPhYDKABLMzM+IQAjL/wH6AoBpz0DPhjT0AMkB+wAD/hCaXwrTP9TSAAGR1JJtAeJVIDP4KAGIyFpZzxbMyXBZIPkAIvkAWtdlAddlggIBNMjLF8sPyw/L/8v/cfkEAMh0AcsCEsoHy//J0PhCcFqAQAXIVSCCEIJ1TrFQBMsfEss/Ac8WIW6zlX8BygDMlHAyygDiyUEwWm1tQAN/yIkVDQ4AEvhCUoDHBfLghACgbW0ibrOZWyBu8tCAbyIBkTLiECRwAwSAQlAjEDZVIhLIz4WAygDPhEDOAfoCgGnPQAJcbgFusJNbz4GdWM+GgM+EgPQA9ADPgeL0AMkB+wAAAWAAXM8WygDPhEDOAfoCgGnPQAJcbgFusJNbz4GdWM+GgM+EgPQA9ADPgeL0AMkB+wABSb4o72omh9IGpqAOhqampqQICA64BAgIDrgBgINAgztgxtnjZAwRAgFIEhMAAicBTbWzvaiaH0gamoA6GpqampAgIDrgECAgOuAGAg0CDO2DCqL7Z42QMBQBSbaffaiaH0gamoA6GpqampAgIDrgECAgOuAGAg0CDO2DG2eNkFAZAYL4KMhQA88WAdDPFsmIyFpZzxbMyXBZIPkAIvkAWtdlAddlggIBNMjLF8sPyw/L/8v/cfkEAMh0AcsCEsoHy//J0BUCvv8AII7RMAHQctch0gDSAPpAIRA0UGZvBPhhAvhi7UTQ+kDUWWwSA5JfA+AB1w0f8uCCAYIQuBTEGrqOlNM/1NRVIGwiUCPbPFsB+wTtVPIA4F8D8sCC4fSkE/S88sgLFhcAEvhCUiDHBfLghAEhplFHe1E0PpA1FlsEts8bCGAYAAIhAAJc',
  )
  const builder = beginCell()
  initPoolFactory_init_args({
    $$type: 'PoolFactory_init_args',
    owner,
    pool_code,
    range_code,
    multitoken_code,
    trade_account_code,
    lp_account_code,
    protocol_fee,
    ref_fee,
  })(builder)
  const __data = builder.endCell()
  return { code: __code, data: __data }
}

export const PoolFactory_errors = {
  2: { message: `Stack underflow` },
  3: { message: `Stack overflow` },
  4: { message: `Integer overflow` },
  5: { message: `Integer out of expected range` },
  6: { message: `Invalid opcode` },
  7: { message: `Type check error` },
  8: { message: `Cell overflow` },
  9: { message: `Cell underflow` },
  10: { message: `Dictionary error` },
  11: { message: `'Unknown' error` },
  12: { message: `Fatal error` },
  13: { message: `Out of gas error` },
  14: { message: `Virtualization error` },
  32: { message: `Action list is invalid` },
  33: { message: `Action list is too long` },
  34: { message: `Action is invalid or not supported` },
  35: { message: `Invalid source address in outbound message` },
  36: { message: `Invalid destination address in outbound message` },
  37: { message: `Not enough Toncoin` },
  38: { message: `Not enough extra currencies` },
  39: { message: `Outbound message does not fit into a cell after rewriting` },
  40: { message: `Cannot process a message` },
  41: { message: `Library reference is null` },
  42: { message: `Library change action error` },
  43: {
    message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree`,
  },
  50: { message: `Account state size exceeded limits` },
  128: { message: `Null reference exception` },
  129: { message: `Invalid serialization prefix` },
  130: { message: `Invalid incoming message` },
  131: { message: `Constraints error` },
  132: { message: `Access denied` },
  133: { message: `Contract stopped` },
  134: { message: `Invalid argument` },
  135: { message: `Code of a contract was not found` },
  136: { message: `Invalid standard address` },
} as const

export const PoolFactory_errors_backward = {
  'Stack underflow': 2,
  'Stack overflow': 3,
  'Integer overflow': 4,
  'Integer out of expected range': 5,
  'Invalid opcode': 6,
  'Type check error': 7,
  'Cell overflow': 8,
  'Cell underflow': 9,
  'Dictionary error': 10,
  "'Unknown' error": 11,
  'Fatal error': 12,
  'Out of gas error': 13,
  'Virtualization error': 14,
  'Action list is invalid': 32,
  'Action list is too long': 33,
  'Action is invalid or not supported': 34,
  'Invalid source address in outbound message': 35,
  'Invalid destination address in outbound message': 36,
  'Not enough Toncoin': 37,
  'Not enough extra currencies': 38,
  'Outbound message does not fit into a cell after rewriting': 39,
  'Cannot process a message': 40,
  'Library reference is null': 41,
  'Library change action error': 42,
  'Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree': 43,
  'Account state size exceeded limits': 50,
  'Null reference exception': 128,
  'Invalid serialization prefix': 129,
  'Invalid incoming message': 130,
  'Constraints error': 131,
  'Access denied': 132,
  'Contract stopped': 133,
  'Invalid argument': 134,
  'Code of a contract was not found': 135,
  'Invalid standard address': 136,
} as const

const PoolFactory_types: ABIType[] = [
  {
    name: 'DataSize',
    header: null,
    fields: [
      { name: 'cells', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'bits', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'refs', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
    ],
  },
  {
    name: 'StateInit',
    header: null,
    fields: [
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'data', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'Context',
    header: null,
    fields: [
      { name: 'bounceable', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'sender', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'value', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'raw', type: { kind: 'simple', type: 'slice', optional: false } },
    ],
  },
  {
    name: 'SendParameters',
    header: null,
    fields: [
      { name: 'mode', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'body', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'data', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'value', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'to', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'bounce', type: { kind: 'simple', type: 'bool', optional: false } },
    ],
  },
  {
    name: 'MessageParameters',
    header: null,
    fields: [
      { name: 'mode', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'body', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'value', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'to', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'bounce', type: { kind: 'simple', type: 'bool', optional: false } },
    ],
  },
  {
    name: 'DeployParameters',
    header: null,
    fields: [
      { name: 'mode', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'body', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'value', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'bounce', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'init', type: { kind: 'simple', type: 'StateInit', optional: false } },
    ],
  },
  {
    name: 'StdAddress',
    header: null,
    fields: [
      { name: 'workchain', type: { kind: 'simple', type: 'int', optional: false, format: 8 } },
      { name: 'address', type: { kind: 'simple', type: 'uint', optional: false, format: 256 } },
    ],
  },
  {
    name: 'VarAddress',
    header: null,
    fields: [
      { name: 'workchain', type: { kind: 'simple', type: 'int', optional: false, format: 32 } },
      { name: 'address', type: { kind: 'simple', type: 'slice', optional: false } },
    ],
  },
  {
    name: 'BasechainAddress',
    header: null,
    fields: [{ name: 'hash', type: { kind: 'simple', type: 'int', optional: true, format: 257 } }],
  },
  {
    name: 'Deploy',
    header: 2490013878,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
    ],
  },
  {
    name: 'DeployOk',
    header: 2952335191,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
    ],
  },
  {
    name: 'FactoryDeploy',
    header: 1829761339,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'cashback', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  {
    name: 'ChangeOwner',
    header: 2174598809,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'newOwner', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  {
    name: 'ChangeOwnerOk',
    header: 846932810,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'newOwner', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  {
    name: 'DeployPoolMsg',
    header: 4255566396,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'seed', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'token1', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'token2', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'bin_step', type: { kind: 'simple', type: 'uint', optional: false, format: 32 } },
      { name: 'lp_fee', type: { kind: 'simple', type: 'uint', optional: false, format: 16 } },
      { name: 'init_bin', type: { kind: 'simple', type: 'int', optional: false, format: 32 } },
      { name: 'init_sqrt_p', type: { kind: 'simple', type: 'uint', optional: false, format: 256 } },
    ],
  },
  {
    name: 'GetterPoolAddress',
    header: 497623280,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'seed', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'forward_payload', type: { kind: 'simple', type: 'cell', optional: true } },
    ],
  },
  {
    name: 'GetterPoolAddressAnswer',
    header: 2188725937,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'pool_address', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'forward_payload', type: { kind: 'simple', type: 'cell', optional: true } },
    ],
  },
  {
    name: 'ChangeCodes',
    header: 4125036946,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'pool_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'range_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'multitoken_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'trade_account_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'lp_account_code', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'ChangeFees',
    header: 3429681529,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'protocol_fee', type: { kind: 'simple', type: 'uint', optional: false, format: 16 } },
      { name: 'ref_fee', type: { kind: 'simple', type: 'uint', optional: false, format: 16 } },
    ],
  },
  {
    name: 'FeesData',
    header: null,
    fields: [
      { name: 'protocol_fee', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'ref_fee', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
    ],
  },
  {
    name: 'VanityDeployMsg',
    header: 3088368666,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'new_data', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'new_code', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'Vanity$Data',
    header: null,
    fields: [
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'seed', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'PoolFactory$Data',
    header: null,
    fields: [
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'pool_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'range_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'multitoken_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'trade_account_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'lp_account_code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'protocol_fee', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'ref_fee', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
    ],
  },
]

const PoolFactory_opcodes = {
  Deploy: 2490013878,
  DeployOk: 2952335191,
  FactoryDeploy: 1829761339,
  ChangeOwner: 2174598809,
  ChangeOwnerOk: 846932810,
  DeployPoolMsg: 4255566396,
  GetterPoolAddress: 497623280,
  GetterPoolAddressAnswer: 2188725937,
  ChangeCodes: 4125036946,
  ChangeFees: 3429681529,
  VanityDeployMsg: 3088368666,
}

const PoolFactory_getters: ABIGetter[] = [
  {
    name: 'get_pool_address',
    methodId: 101789,
    arguments: [
      { name: 'deployer', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'seed', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
    returnType: { kind: 'simple', type: 'address', optional: false },
  },
  {
    name: 'fees',
    methodId: 111867,
    arguments: [],
    returnType: { kind: 'simple', type: 'FeesData', optional: false },
  },
  {
    name: 'owner',
    methodId: 83229,
    arguments: [],
    returnType: { kind: 'simple', type: 'address', optional: false },
  },
]

export const PoolFactory_getterMapping: { [key: string]: string } = {
  get_pool_address: 'getGetPoolAddress',
  fees: 'getFees',
  owner: 'getOwner',
}

const PoolFactory_receivers: ABIReceiver[] = [
  { receiver: 'internal', message: { kind: 'empty' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'DeployPoolMsg' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'ChangeFees' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'ChangeCodes' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'GetterPoolAddress' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'ChangeOwner' } },
]

export class PoolFactory implements Contract {
  public static readonly storageReserve = 0n
  public static readonly errors = PoolFactory_errors_backward
  public static readonly opcodes = PoolFactory_opcodes

  static async init(
    owner: Address,
    pool_code: Cell,
    range_code: Cell,
    multitoken_code: Cell,
    trade_account_code: Cell,
    lp_account_code: Cell,
    protocol_fee: bigint,
    ref_fee: bigint,
  ) {
    return await PoolFactory_init(
      owner,
      pool_code,
      range_code,
      multitoken_code,
      trade_account_code,
      lp_account_code,
      protocol_fee,
      ref_fee,
    )
  }

  static async fromInit(
    owner: Address,
    pool_code: Cell,
    range_code: Cell,
    multitoken_code: Cell,
    trade_account_code: Cell,
    lp_account_code: Cell,
    protocol_fee: bigint,
    ref_fee: bigint,
  ) {
    const __gen_init = await PoolFactory_init(
      owner,
      pool_code,
      range_code,
      multitoken_code,
      trade_account_code,
      lp_account_code,
      protocol_fee,
      ref_fee,
    )
    const address = contractAddress(0, __gen_init)
    return new PoolFactory(address, __gen_init)
  }

  static fromAddress(address: Address) {
    return new PoolFactory(address)
  }

  readonly address: Address
  readonly init?: { code: Cell; data: Cell }
  readonly abi: ContractABI = {
    types: PoolFactory_types,
    getters: PoolFactory_getters,
    receivers: PoolFactory_receivers,
    errors: PoolFactory_errors,
  }

  constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address
    this.init = init
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message: null | DeployPoolMsg | ChangeFees | ChangeCodes | GetterPoolAddress | ChangeOwner,
  ) {
    let body: Cell | null = null
    if (message === null) {
      body = new Cell()
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'DeployPoolMsg'
    ) {
      body = beginCell().store(storeDeployPoolMsg(message)).endCell()
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'ChangeFees'
    ) {
      body = beginCell().store(storeChangeFees(message)).endCell()
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'ChangeCodes'
    ) {
      body = beginCell().store(storeChangeCodes(message)).endCell()
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'GetterPoolAddress'
    ) {
      body = beginCell().store(storeGetterPoolAddress(message)).endCell()
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'ChangeOwner'
    ) {
      body = beginCell().store(storeChangeOwner(message)).endCell()
    }
    if (body === null) {
      throw new Error('Invalid message type')
    }

    await provider.internal(via, { ...args, body: body })
  }

  async getGetPoolAddress(provider: ContractProvider, deployer: Address, seed: Cell) {
    const builder = new TupleBuilder()
    builder.writeAddress(deployer)
    builder.writeCell(seed)
    const source = (await provider.get('get_pool_address', builder.build())).stack
    const result = source.readAddress()
    return result
  }

  async getFees(provider: ContractProvider) {
    const builder = new TupleBuilder()
    const source = (await provider.get('fees', builder.build())).stack
    const result = loadGetterTupleFeesData(source)
    return result
  }

  async getOwner(provider: ContractProvider) {
    const builder = new TupleBuilder()
    const source = (await provider.get('owner', builder.build())).stack
    const result = source.readAddress()
    return result
  }
}
