import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialExecutionParams } from '../types/swap'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates transaction parameters for swapping tokens using a Jetton wallet (v2)
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of jettons to swap
 * @param params.receiverAddress - Optional address of the swap result receiver (defaults to senderAddress)
 * @param params.senderAddress - Address of the swap sender
 * @param params.refundAddress - Optional address of the refund address (defaults to senderAddress)
 * @param params.exactOut - Exact amount of tokens to receive (defaults to 0)
 * @param params.jettonWalletAddress - Address of the sender's jetton wallet
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.allowPartial - Allow partial swap execution if true, require exact amount if false
 * @param params.sqrtX128LastPrice - Last price in sqrt price X 2^128 format (required if `allowPartial` is true)
 * @param params.minAmountToReceive - Minimum amount of tokens to receive (required if `allowPartial` is false)
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.rejectPayload - Optional reject payload for the transaction
 * @param params.swapGasAmount - Optional swap gas amount for the Jetton transfer (defaults to 0.5 TON)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.refAddress - Optional referral address
 * @returns Transaction parameters
 */
export function createJettonSwapV2TxParams(
  params: {
    amountIn: bigint
    receiverAddress?: Address
    senderAddress: Address
    exactOut?: bigint
    jettonWalletAddress: Address
    poolAddress: Address
    queryId?: bigint
    rejectPayload?: Cell
    forwardPayload?: Cell
    swapGasAmount?: bigint
    refundAddress?: Address
    refAddress?: Address
  } & SwapPartialExecutionParams,
): TxParams {
  const {
    exactOut = 0n,
    queryId = generateRandomQueryId(),
    swapGasAmount = toNano('0.5'),
    refundAddress = params.senderAddress,
    receiverAddress = params.senderAddress,
  } = params

  let forwardPayloadBuilder = beginCell()
    .storeUint(PoolContract.Opcodes.SwapV2, 32)
    .storeAddress(receiverAddress)
    .storeBit(params.allowPartial)

  if (params.allowPartial) {
    forwardPayloadBuilder = forwardPayloadBuilder.storeUint(params.sqrtX128LastPrice, 256)
  } else {
    forwardPayloadBuilder = forwardPayloadBuilder.storeCoins(params.minAmountToReceive)
  }

  forwardPayloadBuilder = forwardPayloadBuilder.storeCoins(exactOut)

  const additionalDataBuilder = beginCell().storeAddress(refundAddress)

  if (params.refAddress) {
    additionalDataBuilder.storeAddress(params.refAddress)
  } else {
    additionalDataBuilder.storeUint(0, 2)
  }

  forwardPayloadBuilder = forwardPayloadBuilder.storeMaybeRef(additionalDataBuilder.endCell())

  const forwardPayloadCell = forwardPayloadBuilder
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const jettonTransferTxParams = createTransferJettonTxParams({
    jettonWalletAddress: params.jettonWalletAddress,
    receiverAddress: params.poolAddress,
    amount: params.amountIn,
    senderAddress: params.senderAddress,
    forwardPayload: forwardPayloadCell,
    forwardAmount: swapGasAmount,
    queryId,
  })

  return jettonTransferTxParams
}
