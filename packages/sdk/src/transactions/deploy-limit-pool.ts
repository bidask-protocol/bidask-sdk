import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { POOL_FACTORY_ADDRESS } from '../constants'
import type { TxParams } from '../types'

/**
 * Creates transaction parameters for deploying a limit pool
 * @param params - Parameters for deployment
 * @param params.seed - Seed for shard brute-forcing
 * @param params.token0Address - Address of token0
 * @param params.token1Address - Address of token1
 * @param params.queryId - Query ID (default: 0n)
 */
export function createDeployLimitPoolTxParams(params: {
  seedCell: Cell
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  queryId?: bigint
}): TxParams {
  const { queryId = 0n } = params

  const constantGas = toNano('0.1')

  const payload = beginCell()
    .storeUint(41099919, 32) // deploy limit pool opcode
    .storeUint(queryId, 64)
    .storeRef(params.seedCell)
    .storeAddress(params.token0PoolWalletAddress)
    .storeAddress(params.token1PoolWalletAddress)
    .endCell()

  return {
    to: POOL_FACTORY_ADDRESS,
    value: constantGas,
    payload,
  }
}
