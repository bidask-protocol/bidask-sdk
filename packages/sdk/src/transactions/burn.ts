import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { LiquidityRemoveBins } from '../types/liquidity'
import { createLiquidityBurnDict } from '../utils/liquidity/dictionary'
import { generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for burning liquidity from a pool
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the liquidity pool contract
 * @param params.binsToBurn - Bins to burn
 * @param params.queryId - Optional query ID for the transaction (defaults to 0)
 * @returns Transaction parameters
 */
export function createBurnTxParams(params: {
  lpMultitokenAddress: Address
  binsToBurn: LiquidityRemoveBins
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId() } = params

  const payload = beginCell()
    .storeUint(LpMultitokenContract.Opcodes.Burn, 32)
    .storeUint(queryId, 64)
    .storeDict(createLiquidityBurnDict(params.binsToBurn))
    .storeMaybeRef(null)
    .endCell()

  const providingGas = calculateGas(Object.keys(params.binsToBurn).length)

  return {
    to: params.lpMultitokenAddress,
    value: providingGas,
    payload,
  }
}

const calculateGas = (binsAmount: number): bigint => {
  return toNano('0.8') + BigInt(binsAmount) * toNano('0.005')
}
