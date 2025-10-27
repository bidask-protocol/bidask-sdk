import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * @ignore
 *
 * Creates transaction parameters for claiming DAMM memepool owner fees
 * @param params - Parameters for the transaction
 * @param params.memeAddress - Address of the meme contract
 * @param params.lpWalletAddress - Address of the LP wallet
 * @param params.isAccount - Whether receiver is a trade account
 * @param params.receiverAddress - Address to receive claimed fees
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createClaimDammMemePoolOwnerFeesTxParams(params: {
  memeAddress: Address
  lpWalletAddress: Address
  isAccount?: boolean
  receiverAddress: Address
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId(), isAccount = false } = params

  const payloadCell = beginCell()
    .storeUint(0x95d410ad, 32) // DAMMJettonClaimFees opcode
    .storeUint(queryId, 64) // Query ID
    .storeAddress(params.lpWalletAddress)
    .storeBit(isAccount)
    .storeAddress(params.receiverAddress)
    .storeMaybeRef(params.forwardPayload) // Optional forward payload
    .endCell()

  const constantClaimGas = toNano('0.25')

  return {
    to: params.memeAddress,
    value: constantClaimGas,
    payload: payloadCell,
  }
}
