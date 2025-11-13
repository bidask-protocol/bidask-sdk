import { Address, beginCell, Cell, Contract, ContractProvider } from '@ton/ton'

export class BetEventContract implements Contract {
  static createFromAddress(address: Address) {
    return new BetEventContract(address)
  }

  private constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  async getData(provider: ContractProvider): Promise<{
    outcomeNumber: number
    totalBetAmount: bigint
    comission: number
    timestampEndBets: number
    trueOutcome: number
  }> {
    const { stack } = await provider.get('getESCData', [])

    return {
      outcomeNumber: stack.readNumber(),
      totalBetAmount: stack.readBigNumber(),
      comission: stack.readNumber(),
      timestampEndBets: stack.readNumber(),
      trueOutcome: stack.readNumber(),
    }
  }

  async getBetAddress(
    provider: ContractProvider,
    owner: Address,
    outcome: number,
  ): Promise<Address> {
    const res = await provider.get('getBetAddress', [
      { type: 'slice', cell: beginCell().storeAddress(owner).endCell() },
      { type: 'int', value: BigInt(outcome) },
    ])
    return res.stack.readAddress()
  }
}
