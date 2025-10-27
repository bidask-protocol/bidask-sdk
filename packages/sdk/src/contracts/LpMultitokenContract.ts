import { Address, Cell, Contract, type ContractProvider, Dictionary } from '@ton/ton'

export class LpMultitokenContract implements Contract {
  static Opcodes = {
    BurnAll: 0xebd6ec83,
    Burn: 0x73403c43,
  }

  static create(address: Address) {
    return new LpMultitokenContract(address)
  }

  private constructor(public address: Address) {}

  async getTokens(provider: ContractProvider): Promise<Record<number, bigint>> {
    const result = await provider.get('get_tokens', [])

    const lpDict = result.stack
      .readCellOpt()
      ?.asSlice()
      .loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.BitString(244 * 4))

    if (!lpDict) {
      return {}
    }

    const tokensDict: Record<number, bigint> = {}
    for (const binDictIndex of lpDict.keys()) {
      const bitString = lpDict.get(binDictIndex)

      const cell = new Cell({
        bits: bitString,
        exotic: false,
        refs: [],
      })

      const slice = cell.beginParse()

      for (let positionIndex = 0; positionIndex < 4; positionIndex++) {
        const liquidityAmount = slice.loadUintBig(244)
        const binIndex = binDictIndex * 4 + positionIndex
        tokensDict[binIndex] = liquidityAmount
      }
    }

    return tokensDict
  }

  async getBinsNumber(provider: ContractProvider): Promise<number> {
    const result = await provider.get('get_bins_number', [])

    return result.stack.readNumber()
  }

  async getRangeAddress(provider: ContractProvider): Promise<Address> {
    const result = await provider.get('get_nft_data', [])

    result.stack.readBigNumber() // init?
    result.stack.readBigNumber() // index
    const collectionAddress = result.stack.readAddress()

    return collectionAddress
  }
}
