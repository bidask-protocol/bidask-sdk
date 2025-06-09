import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract } from '../contracts'
import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters to execute a limit order by sending Jettons
 * @param params - Execution parameters
 * @param params.orderIndex - Index of the limit order on the pool
 * @param params.salt - Salt for shard brute-forcing
 * @param params.amountIn - Amount of X to buy
 * @param params.pool - Address of the limit pool
 * @param params.from - Address of the buyer (referral)
 * @param params.forwardPayload - Optional payload on success
 * @param params.rejectPayload - Optional payload on failure
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.value - TON value for gas (default: toNano('0.5'))
 */
export function createExecuteJettonLimitOrderTxParams(params: {
  poolAddress: Address
  orderIndex: bigint
  salt: bigint
  sellJettonWalletAddress: Address
  sellAmount: bigint
  senderAddress: Address
  forwardPayload?: Cell
  rejectPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId() } = params

  const constantGas = toNano('1')

  const forwardPayloadCell = beginCell()
    .storeUint(0xb0936bfb, 32) // execute limit order opcode
    .storeUint(params.orderIndex, 64)
    .storeUint(params.salt, 64)
    .storeMaybeRef(params.forwardPayload)
    .storeMaybeRef(params.rejectPayload)
    .endCell()

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.sellAmount)
    .storeAddress(params.poolAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(constantGas)
    .storeMaybeRef(forwardPayloadCell)
    .endCell()

  return {
    to: params.sellJettonWalletAddress,
    value: constantGas + constantGas,
    payload: jettonTransferBody,
  }
}
