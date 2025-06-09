import { Address, beginCell, Cell, toNano } from '@ton/ton'

import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters to execute a limit order using native TON
 * @param params - Execution parameters
 * @param params.sellAmount - Amount of native TON to use for the execution
 * @param params.salt - Salt for shard brute-forcing the order address
 * @param params.orderIndex - Index of the limit order on the pool
 * @param params.poolAddress - Address of the limit pool
 * @param params.forwardPayload - Optional payload on successful execution
 * @param params.rejectPayload - Optional payload on execution failure
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createExecuteTonLimitOrderTxParams(params: {
  sellAmount: bigint
  salt: bigint
  orderIndex: bigint
  poolAddress: Address
  forwardPayload?: Cell
  rejectPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId() } = params

  const constantGas = toNano('1')

  const payload = beginCell()
    .storeUint(0xb0936bfb, 32) // execute limit order opcode
    .storeUint(queryId, 64)
    .storeCoins(params.sellAmount)
    .storeUint(params.orderIndex, 64)
    .storeUint(params.salt, 64)
    .storeMaybeRef(params.forwardPayload)
    .storeMaybeRef(params.rejectPayload)
    .endCell()

  return {
    to: params.poolAddress,
    value: constantGas + params.sellAmount,
    payload,
  }
}
