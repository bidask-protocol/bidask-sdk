import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * @ignore
 *
 * Creates transaction parameters for claiming memepool fees from LP multitoken contract
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the LP multitoken contract
 * @param params.jettonMasterAddress - Address of the jetton master contract
 * @param params.firstBinGroup - First bin group index for fee claiming
 * @param params.lastBinGroup - Last bin group index for fee claiming
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createClaimMemePoolOwnerFeesTxParams(params: {
  memeAddress: Address
  lpMultitokenAddress: Address
  firstBinGroup: number
  lastBinGroup: number
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId() } = params

  const payloadCell = beginCell()
    .storeUint(0x17c8f2b, 32) // JettonClaimFees opcode
    .storeUint(queryId, 64) // Query ID
    .storeAddress(params.lpMultitokenAddress)
    .storeInt(params.firstBinGroup, 32) // First bin group
    .storeInt(params.lastBinGroup, 32) // Last bin group
    .storeMaybeRef(params.forwardPayload) // Optional forward payload
    .endCell()

  const constantClaimGas = toNano('1')

  return {
    to: params.memeAddress,
    value: constantClaimGas,
    payload: payloadCell,
  }
}
