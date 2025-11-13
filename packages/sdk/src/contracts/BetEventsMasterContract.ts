import { Address, Cell, Contract, ContractProvider } from '@ton/ton'

export class BetEventsMasterContract implements Contract {
  static createFromAddress(address: Address) {
    return new BetEventsMasterContract(address)
  }

  private constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  async getESCAddressBySeed(provider: ContractProvider, seed: Cell): Promise<Address> {
    const { stack } = await provider.get('getESCAddress', [{ type: 'cell', cell: seed }])

    return stack.readAddress()
  }
}
