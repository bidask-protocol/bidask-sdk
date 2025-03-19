import type { Address, Contract, ContractProvider } from '@ton/ton'

export class JettonWalletContract implements Contract {
  static Opcodes = {
    JettonTransfer: 0xf8a7ea5,
  }

  static create(address: Address) {
    return new JettonWalletContract(address)
  }

  private constructor(public address: Address) {}

  async getWalletData(provider: ContractProvider) {
    const result = await provider.get('get_wallet_data', [])

    return {
      balance: result.stack.readBigNumber(),
      owner: result.stack.readAddress(),
      jettonMaster: result.stack.readAddress(),
      jettonWalletCode: result.stack.readCell().toString(),
    }
  }
}
