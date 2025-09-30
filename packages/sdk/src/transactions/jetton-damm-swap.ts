import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates transaction parameters for swapping tokens using a Jetton wallet (DAMM)
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of jettons to swap
 * @param params.receiverAddress - Address of the swap result receiver
 * @param params.slippage - Maximum slippage amount in coins
 * @param params.senderAddress - Address of the swap sender/refund address
 * @param params.exactOut - Exact amount of tokens to receive (defaults to 0)
 * @param params.jettonWalletAddress - Address of the sender's jetton wallet
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.additionalData - Optional additional data cell
 * @param params.rejectPayload - Optional reject payload for the transaction
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.forwardAmount - Optional forward amount for the Jetton transfer (defaults to 0.5 TON)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.refAddress - Optional referral address
 * @returns Transaction parameters
 */
export function createJettonDammSwapTxParams(params: {
  amountIn: bigint
  receiverAddress: Address
  slippage: bigint
  senderAddress: Address
  exactOut?: bigint
  jettonWalletAddress: Address
  poolAddress: Address
  queryId?: bigint
  rejectPayload?: Cell
  forwardPayload?: Cell
  forwardAmount?: bigint
  refAddress?: Address
}): TxParams {
  const { exactOut = 0n, queryId = generateRandomQueryId(), forwardAmount = toNano('0.5') } = params

  const forwardPayload = beginCell()
    .storeUint(0xdd79732c, 32)
    .storeAddress(params.receiverAddress)
    .storeCoins(params.slippage)
    .storeAddress(params.senderAddress)
    .storeCoins(exactOut)
    .storeMaybeRef(null)
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const jettonTransferTxParams = createTransferJettonTxParams({
    jettonWalletAddress: params.jettonWalletAddress,
    receiverAddress: params.poolAddress,
    amount: params.amountIn,
    senderAddress: params.senderAddress,
    forwardPayload,
    forwardAmount,
    queryId,
  })

  return jettonTransferTxParams
}
