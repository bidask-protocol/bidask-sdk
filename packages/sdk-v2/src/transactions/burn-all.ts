import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'

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
