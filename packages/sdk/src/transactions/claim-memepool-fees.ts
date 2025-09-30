import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * @ignore
 *
 * Creates transaction parameters for claiming memepool fees from LP multitoken contract
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the LP multitoken contract
 * @param params.snedToTradeAccount - Send to trade account flag (defaults to false)
 * @param params.receiverAddress - Address to receive the claimed fees
 * @param params.firstBinGroup - First bin group index for fee claiming
 * @param params.lastBinGroup - Last bin group index for fee claiming
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createClaimMemePoolFeesTxParams(params: {
  lpMultitokenAddress: Address
  receiverIsTradeAccount?: boolean
  receiverAddress: Address
  firstBinGroup: number
  lastBinGroup: number
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId(), receiverIsTradeAccount = false } = params

  const payloadCell = beginCell()
    .storeUint(0x933771a8, 32) // ClaimFees opcode
    .storeUint(queryId, 64) // Query ID
    .storeBit(receiverIsTradeAccount) // Account flag
    .storeAddress(params.receiverAddress) // Receiver address
    .storeInt(params.firstBinGroup, 32) // First bin group
    .storeInt(params.lastBinGroup, 32) // Last bin group
    .storeMaybeRef(params.forwardPayload) // Optional forward payload
    .endCell()

  const constantClaimGas = toNano('1')

  return {
    to: params.lpMultitokenAddress,
    value: constantClaimGas,
    payload: payloadCell,
  }
}
