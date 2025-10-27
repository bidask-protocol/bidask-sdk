import { Address, beginCell, Cell, Contract, type ContractProvider, Dictionary } from '@ton/ton'

export class RangeContract implements Contract {
  static create(address: Address) {
    return new RangeContract(address)
  }

  private constructor(public address: Address) {}

  async getSqrtPrice(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('get_sqrt_price', [])

    return result.stack.readBigNumber()
  }

  async getLpMultitokenWallet(provider: ContractProvider, userAddress: Address): Promise<Address> {
    const result = await provider.get('get_lp_multitoken_wallet', [
      { type: 'slice', cell: beginCell().storeAddress(userAddress).endCell() },
    ])

    return result.stack.readAddress()
  }

  async getCurrentBin(provider: ContractProvider): Promise<number> {
    const result = await provider.get('get_current_bin', [])

    return result.stack.readNumber()
  }

  async getBinStep(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('get_bin_step', [])

    return result.stack.readBigNumber()
  }

  async getBinsDicts(provider: ContractProvider): Promise<{
    totalLiquidityDict: Record<number, bigint>
    lpSupplyDict: Record<number, bigint>
  }> {
    const result = await provider.get('get_bins_dicts', [])

    const liquidityDictCell = result.stack.readCellOpt()
    const lpSupplyDictCell = result.stack.readCellOpt()

    const totalLiquidityDict = this.parseDict(liquidityDictCell)
    const lpSupplyDict = this.parseDict(lpSupplyDictCell)

    return { totalLiquidityDict, lpSupplyDict }
  }

  private parseDict(cell: Cell | null): Record<number, bigint> {
    if (!cell) {
      return {}
    }

    const dict = cell
      .asSlice()
      .loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.BitString(244 * 4))

    if (!dict) {
      return {}
    }

    const result: Record<number, bigint> = {}

    for (const binDictIndex of dict.keys()) {
      const bitString = dict.get(binDictIndex)

      const dataCell = new Cell({
        bits: bitString,
        exotic: false,
        refs: [],
      })

      const slice = dataCell.beginParse()

      for (let positionIndex = 0; positionIndex < 4; positionIndex++) {
        const value = slice.loadUintBig(244) << 12n
        const binIndex = binDictIndex * 4 + positionIndex
        result[binIndex] = value
      }
    }

    return result
  }
}
