import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates transaction parameters for providing single-side liquidity to a DAMM pool
 * @param params - Parameters for the transaction
 * @param params.jettonWalletAddress - Address of the jetton wallet
 * @param params.amount - Amount of jettons to provide
 * @param params.senderAddress - Address of the liquidity provider
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.receiverAddress - Address to receive liquidity tokens (defaults to senderAddress)
 * @param params.lockLiquidity - Whether to lock the liquidity
 * @param params.rejectPayload - Optional payload for transaction rejection
 * @param params.forwardPayload - Optional payload for successful transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createProvideSinglesideLiquidityDammTxParams(params: {
  jettonWalletAddress: Address
  amount: bigint
  senderAddress: Address
  poolAddress: Address
  receiverAddress?: Address
  lockLiquidity?: boolean
  rejectPayload?: Cell
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const {
    queryId = generateRandomQueryId(),
    receiverAddress = params.senderAddress,
    lockLiquidity = false,
  } = params

  const providingGas = toNano('0.5')

  const forwardPayload = beginCell()
    .storeUint(0x729c04c8, 32) // DepositJettonSingleSide opcode
    .storeAddress(receiverAddress)
    .storeBit(lockLiquidity)
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return createTransferJettonTxParams({
    jettonWalletAddress: params.jettonWalletAddress,
    receiverAddress: params.poolAddress,
    amount: params.amount,
    senderAddress: params.senderAddress,
    forwardPayload,
    forwardAmount: providingGas,
    queryId,
  })
}
