import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { POOL_FACTORY_ADDRESS } from '../constants'
import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

export const createDeployDammPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  tokenXAmount: bigint
  tokenYAmount: bigint
  virtualXAmount: bigint
  virtualYAmount: bigint
  baseFee: bigint
  dynamicFeeFactor: bigint
  timeFilter: bigint
  timeDecay: bigint
  poolStartTimestamp?: number
  poolDeployerAddress?: Address
  queryId?: bigint
  seedCell: Cell
}): TxParams => {
  const {
    queryId = generateRandomQueryId(),
    poolDeployerAddress = POOL_FACTORY_ADDRESS,
    poolStartTimestamp = 0,
  } = params

  if (params.timeFilter < 0n) {
    throw new Error('timeFilter must be >= 0')
  }

  if (params.timeFilter >= params.timeDecay) {
    throw new Error('timeFilter must be < timeDecay')
  }

  const deployDammPoolPayload = beginCell()
    .storeUint(0x0273228f, 32)
    .storeUint(queryId, 64)
    .storeRef(params.seedCell)
    .storeAddress(params.token0PoolWalletAddress)
    .storeAddress(params.token1PoolWalletAddress)
    .storeUint(params.baseFee, 16)
    .storeUint(params.dynamicFeeFactor, 32)
    .storeUint(params.timeFilter, 32)
    .storeUint(params.timeDecay, 32)
    .storeUint(poolStartTimestamp, 64)
    .storeCoins(params.tokenXAmount)
    .storeRef(
      beginCell()
        .storeCoins(params.tokenYAmount)
        .storeCoins(params.virtualXAmount)
        .storeCoins(params.virtualYAmount),
    )
    .endCell()

  const constantGas = toNano('0.06')

  return {
    to: poolDeployerAddress,
    value: constantGas,
    payload: deployDammPoolPayload,
  }
}
