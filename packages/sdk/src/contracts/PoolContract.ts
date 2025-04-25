import { Address, beginCell, Contract, type ContractProvider } from '@ton/ton'

import { PoolInfo } from '../types'
import { createSeedCell } from '../utils'
import { bufferToBigInt } from '../utils/bigint'

export class PoolContract implements Contract {
  static Opcodes = {
    Swap: 0xf2ef6c1b,
    AddLiquidity: 0x96feef7b,
    AddBothLiquidity: 0x3ea0bafc,
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

  async getTradeAccountAddress(
    provider: ContractProvider,
    params: { userAddress: Address; publicKey: Buffer; seed: number },
  ): Promise<Address> {
    const result = await provider.get('get_trade_account_address', [
      { type: 'slice', cell: beginCell().storeAddress(params.userAddress).endCell() },
      { type: 'int', value: bufferToBigInt(params.publicKey) },
      { type: 'cell', cell: createSeedCell(params.seed) },
    ])

    return result.stack.readAddress()
  }
}
