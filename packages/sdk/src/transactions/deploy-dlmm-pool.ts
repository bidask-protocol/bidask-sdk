import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { POOL_FACTORY_ADDRESS } from '../constants'
import type { TxParams } from '../types'
import { generateRandomQueryId, getBinByPrice, getSqrtPriceX128 } from '../utils'

/**
 * Creates a transaction parameters for deploying a DLMM pool
 * @param params - Parameters for the transaction
 * @param params.token0PoolWalletAddress - Address of the token0 pool wallet
 * @param params.token1PoolWalletAddress - Address of the token1 pool wallet
 * @param params.bps - Basis points for price calculation
 * @param params.baseFee - Base fee
 * @param params.dynamicFeeFactor - Dynamic fee factor
 * @param params.timeFilter - Time filter value (must be >= 0)
 * @param params.timeDecay - Time decay value (must be > timeFilter)
 * @param params.initialRawPrice - Initial raw price of the pool
 * @param params.seedCell - Seed cell for the pool
 * @param params.poolDeployerAddress - Optional address of the pool deployer (defaults to POOL_FACTORY_ADDRESS)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export const createDeployDlmmPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  bps: bigint
  baseFee: bigint
  dynamicFeeFactor: bigint
  timeFilter: bigint
  timeDecay: bigint
  initialRawPrice: number
  seedCell: Cell
  poolDeployerAddress?: Address
  queryId?: bigint
}): TxParams => {
  if (params.timeFilter < 0n) {
    throw new Error('timeFilter must be >= 0')
  }

  if (params.timeFilter >= params.timeDecay) {
    throw new Error('timeFilter must be < timeDecay')
  }
  
  const { poolDeployerAddress = POOL_FACTORY_ADDRESS, queryId = generateRandomQueryId() } =
    params

  const initSqrtPriceCell = beginCell()
    .storeUint(getSqrtPriceX128(params.initialRawPrice), 256)
    .endCell()

  const deployDlmmPoolPayload = beginCell()
    .storeUint(0xfda6ca3c, 32)
    .storeUint(queryId, 64)
    .storeRef(params.seedCell)
    .storeAddress(params.token0PoolWalletAddress)
    .storeAddress(params.token1PoolWalletAddress)
    .storeUint(params.bps, 32)
    .storeUint(params.baseFee, 16)
    .storeUint(params.dynamicFeeFactor, 32)
    .storeUint(params.timeFilter, 32)
    .storeUint(params.timeDecay, 32)
    .storeInt(getBinByPrice(params.initialRawPrice, params.bps), 32)
    .storeRef(initSqrtPriceCell)
    .endCell()

  const constantGas = toNano('0.06')

  return {
    to: poolDeployerAddress,
    value: constantGas,
    payload: deployDlmmPoolPayload,
  }
}
