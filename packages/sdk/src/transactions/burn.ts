import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { LiquidityRemoveBins } from '../types/liquidity'
import { createLiquidityBurnDict } from '../utils/liquidity/dictionary'

/**
 * Creates a transaction parameters for burning liquidity from a pool
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the liquidity pool contract
 * @param params.binsToBurn - Bins to burn
 * @returns Transaction parameters
 */
export function createBurnTxParams(params: {
  lpMultitokenAddress: Address
  binsToBurn: LiquidityRemoveBins
}): TxParams {
  const payload = beginCell()
    .storeUint(LpMultitokenContract.Opcodes.Burn, 32)
    .storeUint(0, 64)
    .storeDict(createLiquidityBurnDict(params.binsToBurn))
    .storeMaybeRef(null)
    .endCell()

  const constantGas = toNano('1')

  return {
    to: params.lpMultitokenAddress,
    value: constantGas,
    payload,
  }
}
