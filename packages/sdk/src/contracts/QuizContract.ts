import { Address, beginCell, Cell, Contract, ContractProvider } from '@ton/ton'

export class QuizContract implements Contract {
  protected constructor(readonly address: Address) {}

  static createFromAddress(address: Address) {
    return new QuizContract(address)
  }

  async sendExternalAnswer(
    provider: ContractProvider,
    opts: {
      recipientAddress: Address
      answer: Cell
    },
  ) {
    await provider.external(
      beginCell()
        .storeUint(0xeea78206, 32)
        .storeAddress(opts.recipientAddress)
        .storeRef(opts.answer)
        .endCell(),
    )
  }

  async getAnswerHash(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('getAnswerHash', [])
    return result.stack.readBigNumber()
  }
}
