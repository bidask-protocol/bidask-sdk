import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { POOL_FACTORY_ADDRESS } from '../constants'
import { PoolFactory } from '../contracts'
import type { TxParams } from '../types'
import { getBinByPrice, getSqrtPriceX128, generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for deploying a pool
 * @param params - Parameters for the transaction
 * @param params.token0PoolWalletAddress - Address of the token0 pool wallet
 * @param params.token1PoolWalletAddress - Address of the token1 pool wallet
 * @param params.bps - Basis points for fee calculation
 * @param params.lpFee - Liquidity provider fee
 * @param params.initialRawPrice - Initial raw price of the pool
 * @param params.seedCell - Seed cell for the pool
 * @param params.queryId - Optional query ID for the transaction (defaults to 0)
 */
export const createDeployPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  bps: bigint
  lpFee: bigint
  initialRawPrice: number
  seedCell: Cell
  poolDeployerAddress?: Address
  queryId?: bigint
}): TxParams => {
  const { poolDeployerAddress = POOL_FACTORY_ADDRESS, queryId = generateRandomQueryId() } = params

  const deployPoolPayload = beginCell()
    .storeUint(PoolFactory.opcodes.DeployPoolMsg, 32)
    .storeUint(queryId, 64)
    .storeRef(params.seedCell)
    .storeAddress(params.token0PoolWalletAddress)
    .storeAddress(params.token1PoolWalletAddress)
    .storeUint(params.bps, 32)
    .storeUint(params.lpFee, 16)
    .storeInt(getBinByPrice(params.initialRawPrice, params.bps), 32)
    .storeUint(getSqrtPriceX128(params.initialRawPrice), 256)
    .endCell()

  const constantGas = toNano('0.06')

  return {
    to: poolDeployerAddress,
    value: constantGas,
    payload: deployPoolPayload,
  }
}
