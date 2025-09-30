import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for swapping TON using DAMM
 * @param params - Parameters for the transaction
 * @param params.nativeAmount - Amount of TON to swap
 * @param params.receiverAddress - Address of the swap result receiver
 * @param params.slippage - Maximum slippage amount in coins
 * @param params.senderAddress - Address of the swap sender/refund address
 * @param params.exactOut - Exact amount of tokens to receive (defaults to 0)
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.additionalData - Optional additional data cell
 * @param params.rejectPayload - Optional reject payload for the transaction
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.refAddress - Optional referral address
 * @returns Transaction parameters
 */
export function createTonDammSwapTxParams(params: {
  nativeAmount: bigint
  receiverAddress: Address
  slippage: bigint
  senderAddress: Address
  exactOut?: bigint
  poolAddress: Address
  additionalData?: Cell
  rejectPayload?: Cell
  forwardPayload?: Cell
  queryId?: bigint
  refAddress?: Address
}): TxParams {
  const { exactOut = 0n, queryId = generateRandomQueryId() } = params

  const body = beginCell()
    .storeUint(0xdd79732c, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.nativeAmount)
    .storeAddress(params.receiverAddress)
    .storeCoins(params.slippage)
    .storeAddress(params.senderAddress)
    .storeCoins(exactOut)
    .storeMaybeRef(null)
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const constantSwapGas = toNano('0.5')

  return {
    to: params.poolAddress,
    value: params.nativeAmount + constantSwapGas,
    payload: body,
  }
}
