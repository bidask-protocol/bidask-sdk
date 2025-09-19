import { Address, Cell } from '@ton/ton'

import type { TxParams } from '../types'
import { createDeployDlmmPoolTxParams } from './deploy-dlmm-pool'

/**
 * Creates a transaction parameters for deploying a CLMM pool (with hardcoded DLMM parameters)
 * @param params - Parameters for the transaction
 * @param params.token0PoolWalletAddress - Address of the token0 pool wallet
 * @param params.token1PoolWalletAddress - Address of the token1 pool wallet
 * @param params.bps - Basis points for price calculation
 * @param params.baseFee - Base fee
 * @param params.initialRawPrice - Initial raw price of the pool
 * @param params.seedCell - Seed cell for the pool
 * @param params.poolDeployerAddress - Optional address of the pool deployer (defaults to POOL_FACTORY_ADDRESS)
 * @param params.initSqrtPriceX128 - Optional initial sqrt price X 128 (defaults to the price calculated from initialRawPrice)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export const createDeployClmmPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  bps: bigint
  baseFee: bigint
  initialRawPrice: number
  seedCell: Cell
  poolDeployerAddress?: Address
  initSqrtPriceX128?: bigint
  queryId?: bigint
}): TxParams => {
  return createDeployDlmmPoolTxParams({
    ...params,
    dynamicFeeFactor: 0n,
    timeFilter: 0n,
    timeDecay: 1n,
  })
}
