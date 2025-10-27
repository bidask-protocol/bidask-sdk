import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for claiming accumulated fees from a DAMM pool
 * @param params - Parameters for the transaction
 * @param params.lpWalletAddress - Address of the user's LP wallet
 * @param params.isAccount - Whether receiver is a trade account
 * @param params.receiverAddress - Address to receive claimed fees (defaults to senderAddress)
 * @param params.senderAddress - Address of the liquidity provider
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createClaimDammFeesTxParams(params: {
  lpWalletAddress: Address
  isAccount?: boolean
  receiverAddress?: Address
  senderAddress: Address
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const {
    queryId = generateRandomQueryId(),
    receiverAddress = params.senderAddress,
    isAccount = false,
  } = params

  const body = beginCell()
    .storeUint(0x26fa12a4, 32) // ClaimFees opcode
    .storeUint(queryId, 64)
    .storeBit(isAccount)
    .storeAddress(receiverAddress)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const constantClaimGas = toNano('0.25')

  return {
    to: params.lpWalletAddress,
    value: constantClaimGas, // Gas for claim operation
    payload: body,
  }
}
