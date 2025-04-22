import { Address, beginCell, toNano } from '@ton/ton'

import type { TxParams } from '../types'

/**
 * Creates transaction parameters for canceling a limit order
 * @param params - Cancellation parameters
 * @param params.orderAddress - Address of the limit order contract
 * @param params.queryId - Query ID (default: 0n)
 */
export function createCancelLimitOrderTxParams(params: {
  orderAddress: Address
  queryId?: bigint
}): TxParams {
  const { orderAddress, queryId = 0n } = params

  const constantGas = toNano('1')

  const body = beginCell()
    .storeUint(0x60c69e06, 32) // cancel limit order opcode
    .storeUint(queryId, 64)
    .endCell()

  return { to: orderAddress, value: constantGas, payload: body }
}
