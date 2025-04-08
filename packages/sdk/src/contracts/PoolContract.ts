import { Address, Contract, type ContractProvider } from '@ton/ton'

import { PoolInfo } from '../types'

export class PoolContract implements Contract {
  static Opcodes = {
    Swap: 0xca2663c4,
    AddLiquidity: 0x406d7624,
    AddBothLiquidity: 0x64dbad78,
  }

  static create(address: Address) {
    return new PoolContract(address)
  }

  private constructor(public address: Address) {}

  async getPoolInfo(provider: ContractProvider): Promise<PoolInfo> {
    const result = await provider.get('get_pool_info', [])

    return {
      token0Wallet: result.stack.readAddress(),
      token1Wallet: result.stack.readAddress(),
      bps: result.stack.readBigNumber(),
      fee: result.stack.readBigNumber(),
    }
  }

  async getActiveRange(provider: ContractProvider): Promise<Address> {
    const result = await provider.get('get_active_range', [])

    return result.stack.readAddress()
  }
}
