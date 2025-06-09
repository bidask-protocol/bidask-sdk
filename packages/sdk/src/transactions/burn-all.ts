import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for burning all liquidity from a pool
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the liquidity pool contract
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createBurnAllTxParams(params: {
  queryId?: bigint
  lpMultitokenAddress: Address
}): TxParams {
  const { queryId = generateRandomQueryId() } = params

  const payload = beginCell()
    .storeUint(LpMultitokenContract.Opcodes.BurnAll, 32)
    .storeUint(queryId, 64)
    .storeMaybeRef(null)
    .endCell()

  const constantGas = toNano('1')

  return {
    to: params.lpMultitokenAddress,
    value: constantGas,
    payload,
  }
}
