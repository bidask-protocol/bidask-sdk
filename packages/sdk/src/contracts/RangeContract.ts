import { Address, beginCell, Contract, type ContractProvider } from '@ton/ton'

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
}
