import { Address, beginCell, Cell, Contract, type ContractProvider } from '@ton/ton'

import { LiquidityProvideBins, PoolInfo, RangeStatus } from '../types'
import { getFirstBinByRange, getRangeByBin } from '../utils'
import { RangeContract } from './RangeContract'

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
    params: { userAddress: Address; seedCell: Cell },
  ): Promise<Address> {
    const result = await provider.get('get_trade_account_address', [
      { type: 'slice', cell: beginCell().storeAddress(params.userAddress).endCell() },
      { type: 'cell', cell: params.seedCell },
    ])

    return result.stack.readAddress()
  }

  async getRangeAddress(provider: ContractProvider, firstBin: number): Promise<Address> {
    const result = await provider.get('get_range_address', [
      { type: 'int', value: BigInt(firstBin) },
    ])

    return result.stack.readAddress()
  }

  async getRangesStatusesByLiquidityBins(
    provider: ContractProvider,
    liquidityBins: LiquidityProvideBins,
  ): Promise<Record<number, RangeStatus>> {
    const ranges = Object.keys(liquidityBins).reduce((acc, bin) => {
      const range = getRangeByBin(Number(bin))

      acc.add(range)

      return acc
    }, new Set<number>())

    const rangeStatuses = await Promise.all(
      Array.from(ranges).map(async (range) => {
        const status = await this.getRangeStatus(provider, range).catch(
          () => RangeStatus.Uninitialized,
        )

        return [range, status]
      }),
    )

    return Object.fromEntries(rangeStatuses)
  }

  async getRangeStatus(provider: ContractProvider, range: number): Promise<RangeStatus> {
    const rangeAddress = await this.getRangeAddress(provider, getFirstBinByRange(range))

    const rangeContract = RangeContract.create(rangeAddress)
    const openedRangeContract = provider.open(rangeContract)

    const sqrtPrice = await openedRangeContract.getSqrtPrice()

    if (sqrtPrice === 0n) {
      return RangeStatus.Uninitialized
    }

    return RangeStatus.Initialized
  }
}
