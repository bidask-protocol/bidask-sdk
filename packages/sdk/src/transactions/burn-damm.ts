import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for burning liquidity from a DAMM pool
 * @param params - Parameters for the transaction
 * @param params.lpWalletAddress - Address of the user's LP wallet
 * @param params.jettonAmount - Amount of LP jettons to burn
 * @param params.isAccount - Whether receiver is a trade account
 * @param params.receiverAddress - Address to receive burned liquidity
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createBurnDammTxParams(params: {
  lpWalletAddress: Address
  jettonAmount: bigint
  isAccount?: boolean
  receiverAddress: Address
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId(), isAccount = false } = params

  const body = beginCell()
    .storeUint(0x71e4a09a, 32) // Burn opcode
    .storeUint(queryId, 64)
    .storeCoins(params.jettonAmount)
    .storeBit(isAccount)
    .storeAddress(params.receiverAddress)
    .storeBit(0)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return {
    to: params.lpWalletAddress,
    value: toNano('0.8'), // Gas for burn operation
    payload: body,
  }
}
