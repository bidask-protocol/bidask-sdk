import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  Slice,
} from '@ton/ton'

import { MEME_VANITY_CODE, MEME_VANITY_CODE_CELL } from '../constants'

export type MemeVanityConfig = {
  factory: Address
  seed: Cell
  deployer: Address
  rest?: Slice
}

function vanityConfigToCell(config: MemeVanityConfig): Cell {
  return beginCell()
    .storeAddress(config.factory)
    .storeAddress(config.deployer)
    .storeRef(config.seed)
    .storeSlice(config.rest ?? beginCell().asSlice())
    .endCell()
}

/**
 * @ignore
 */
export class MemeVanity implements Contract {
  static code = MEME_VANITY_CODE
  static codeCell = MEME_VANITY_CODE_CELL

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new MemeVanity(address)
  }

  static createFromConfig(config: MemeVanityConfig, code: Cell, workchain = 0) {
    const data = vanityConfigToCell(config)
    const init = { code, data }
    return new MemeVanity(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, body: Cell) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: body,
    })
  }

  static deployMessage(code: Cell, data: Cell, op?: number, restData?: Slice) {
    return beginCell()
      .storeUint(op ?? 0, 32)
      .storeUint(0, 64)
      .storeRef(code)
      .storeRef(data)
      .storeSlice(restData ?? beginCell().asSlice())
      .endCell()
  }
}
