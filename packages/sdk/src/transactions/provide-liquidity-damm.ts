import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates transaction parameters for providing liquidity to a DAMM Jetton/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.jettonWalletAddress0 - Address of the token0 jetton wallet
 * @param params.jettonWalletAddress1 - Address of the token1 jetton wallet
 * @param params.amount0 - Amount of token0 to provide
 * @param params.amount1 - Amount of token1 to provide
 * @param params.senderAddress - Address of the liquidity provider
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.receiverAddress - Address to receive liquidity tokens (defaults to senderAddress)
 * @param params.isReceiverAccount - Whether receiver is a trade account
 * @param params.lockLiquidity - Whether to lock the liquidity
 * @param params.rejectPayload - Optional payload for transaction rejection
 * @param params.forwardPayload - Optional payload for successful transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Array of transaction parameters
 */
export function createProvideLiquidityDammTxParams(params: {
  jettonWalletAddress0: Address
  jettonWalletAddress1: Address
  amount0: bigint
  amount1: bigint
  senderAddress: Address
  poolAddress: Address
  receiverAddress?: Address
  isReceiverAccount?: boolean
  lockLiquidity?: boolean
  rejectPayload?: Cell
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams[] {
  const {
    queryId = generateRandomQueryId(),
    receiverAddress = params.senderAddress,
    isReceiverAccount = false,
    lockLiquidity = false,
  } = params

  const forwardPayload = beginCell()
    .storeUint(0x63ec24ae, 32)
    .storeAddress(receiverAddress)
    .storeBit(lockLiquidity)
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const providingGas = toNano('0.8')
  const groupMessages: TxParams[] = []

  if (params.amount0 > 0n) {
    groupMessages.push(
      createTransferJettonTxParams({
        jettonWalletAddress: params.jettonWalletAddress0,
        receiverAddress: params.poolAddress,
        amount: params.amount0,
        senderAddress: params.senderAddress,
        forwardPayload: forwardPayload,
        forwardAmount: providingGas,
        queryId,
      }),
    )
  }

  if (params.amount1 > 0n) {
    groupMessages.push(
      createTransferJettonTxParams({
        jettonWalletAddress: params.jettonWalletAddress1,
        receiverAddress: params.poolAddress,
        amount: params.amount1,
        senderAddress: params.senderAddress,
        forwardPayload: forwardPayload,
        forwardAmount: providingGas,
        queryId,
      }),
    )
  }

  return groupMessages
}