import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'

/**
 * Creates a transaction parameters for burning all liquidity from a pool
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the liquidity pool contract
 * @returns Transaction parameters
 */
export function createBurnAllTxParams(params: { lpMultitokenAddress: Address }): TxParams {
  const payload = beginCell()
    .storeUint(LpMultitokenContract.Opcodes.BurnAll, 32)
    .storeUint(0, 64)
    .storeMaybeRef(null)
    .endCell()

  const constantGas = toNano('1')

  return {
    to: params.lpMultitokenAddress,
    value: constantGas,
    payload,
  }
}
