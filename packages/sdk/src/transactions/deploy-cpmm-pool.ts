import { Address, Cell } from '@ton/ton'

import type { TxParams } from '../types'
import { createDeployDammPoolTxParams } from './deploy-damm-pool'

/**
 * Creates a transaction parameters for deploying a CPMM pool (with hardcoded DAMM parameters)
 * @param params - Parameters for the transaction
 * @param params.token0PoolWalletAddress - Address of the token0 pool wallet
 * @param params.token1PoolWalletAddress - Address of the token1 pool wallet
 * @param params.tokenXAmount - Amount of token X
 * @param params.tokenYAmount - Amount of token Y
 * @param params.virtualXAmount - Virtual amount of token X
 * @param params.virtualYAmount - Virtual amount of token Y
 * @param params.baseFee - Base fee
 * @param params.seedCell - Seed cell for the pool
 * @param params.poolDeployerAddress - Optional address of the pool deployer (defaults to POOL_FACTORY_ADDRESS)
 * @param params.poolStartTimestamp - Optional pool start timestamp (defaults to 0)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export const createDeployCpmmPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  tokenXAmount: bigint
  tokenYAmount: bigint
  virtualXAmount: bigint
  virtualYAmount: bigint
  baseFee: bigint
  seedCell: Cell
  poolDeployerAddress?: Address
  poolStartTimestamp?: number
  queryId?: bigint
}): TxParams => {
  return createDeployDammPoolTxParams({
    ...params,
    dynamicFeeFactor: 0n,
    timeFilter: 0n,
    timeDecay: 1n,
  })
}
