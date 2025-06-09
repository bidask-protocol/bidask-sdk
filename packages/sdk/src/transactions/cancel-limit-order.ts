import { Address, beginCell, toNano } from '@ton/ton'

import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for canceling a limit order
 * @param params - Cancellation parameters
 * @param params.orderAddress - Address of the limit order contract
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createCancelLimitOrderTxParams(params: {
  orderAddress: Address
  queryId?: bigint
}): TxParams {
  const { orderAddress, queryId = generateRandomQueryId() } = params

  const constantGas = toNano('1')

  const body = beginCell()
    .storeUint(0x60c69e06, 32) // cancel limit order opcode
    .storeUint(queryId, 64)
    .endCell()

  return { to: orderAddress, value: constantGas, payload: body }
}
