import { Address, beginCell, Cell, toNano } from '@ton/ton'

import type { TxParams } from '../types'

/**
 * Creates transaction parameters to execute a limit order using native TON
 * @param params - Execution parameters
 * @param params.nativeAmount - Amount of native TON to use for the swap
 * @param params.salt - Salt for shard brute-forcing the order address
 * @param params.orderIndex - Index of the limit order on the pool (default: 0n)
 * @param params.pool - Address of the limit pool
 * @param params.forwardPayload - Optional payload on successful swap
 * @param params.rejectPayload - Optional payload on unused ton return
 * @param params.queryId - Query ID (default: 0n)
 * @param params.value - TON value for gas (default: toNano('1'))
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
  const { queryId = 0n } = params

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
