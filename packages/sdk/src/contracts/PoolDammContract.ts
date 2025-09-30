import { Address, Contract, type ContractProvider } from '@ton/ton'

import { PoolDammInfo } from '../types'

export class PoolDammContract implements Contract {
  static Opcodes = {}

  static create(address: Address) {
    return new PoolDammContract(address)
  }

  private constructor(public address: Address) {}

  async getPoolInfo(provider: ContractProvider): Promise<PoolDammInfo> {
    const result = await provider.get('get_pool_info', [])

    return {
      token0Wallet: result.stack.readAddress(),
      token1Wallet: result.stack.readAddress(),
      fee: result.stack.readBigNumber(),
    }
  }
}
