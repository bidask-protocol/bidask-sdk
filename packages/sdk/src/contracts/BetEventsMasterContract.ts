import { Address, Cell, Contract, ContractProvider, TupleBuilder } from '@ton/ton'

export class BetEventsMasterContract implements Contract {
  static createFromAddress(address: Address) {
    return new BetEventsMasterContract(address)
  }

  private constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  async getESCAddressById(provider: ContractProvider, eventId: bigint): Promise<Address> {
    const builder = new TupleBuilder()
    builder.writeNumber(eventId)

    const { stack } = await provider.get('getESCAddress', builder.build())

    return stack.readAddress()
  }

  async getNextEventId(provider: ContractProvider): Promise<bigint> {
    const { stack } = await provider.get('getNextEventId', [])

    return stack.readBigNumber()
  }
}
