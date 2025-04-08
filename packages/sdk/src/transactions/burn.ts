import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { LiquidityRemoveBins } from '../types/liquidity'
import { createLiquidityBurnDict } from '../utils/liquidity/dictionary'

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
