import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialExecutionParams } from '../types/swap'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates a transaction parameters for swapping tokens using a Jetton wallet
 * @deprecated Use createJettonSwapV2TxParams instead
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of jettons to swap
 * @param params.tokenIn - Address of the input token
 * @param params.receiverAddress - Address of the swap result receiver
 * @param params.senderAddress - Address of the swap sender
 * @param params.exactOut - Exact amount of tokens to receive (optional, defaults to 0)
 * @param params.jettonWalletAddress - Address of the sender's jetton wallet
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.allowPartial - Allow partial swap execution if true, require exact amount if false
 * @param params.sqrtX128LastPrice - Last price in sqrt price X 2^128 format (required if `allowPartial` is true)
 * @param params.minAmountToReceive - Minimum amount of tokens to receive (required if `allowPartial` is false)
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.rejectPayload - Optional reject payload for the transaction
 * @param params.swapGasAmount - Optional swap gas amount for the Jetton transfer (defaults to 0.5 TON)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createJettonSwapTxParams(
  params: {
    amountIn: bigint
    tokenIn: Address
    receiverAddress: Address
    senderAddress: Address
    exactOut?: bigint
    jettonWalletAddress: Address
    poolAddress: Address
    queryId?: bigint
    rejectPayload?: Cell
    forwardPayload?: Cell
    swapGasAmount?: bigint
  } & SwapPartialExecutionParams,
): TxParams {
  const { exactOut = 0n, queryId = generateRandomQueryId(), swapGasAmount = toNano('0.5') } = params

  let forwardPayloadBuilder = beginCell()
    .storeUint(PoolContract.Opcodes.Swap, 32)
    .storeAddress(params.receiverAddress)
    .storeBit(params.allowPartial)

  if (params.allowPartial) {
    forwardPayloadBuilder = forwardPayloadBuilder.storeUint(params.sqrtX128LastPrice, 256)
  } else {
    forwardPayloadBuilder = forwardPayloadBuilder.storeCoins(params.minAmountToReceive)
  }

  const forwardPayloadCell = forwardPayloadBuilder
    .storeCoins(exactOut)
    .storeAddress(null)
    .storeMaybeRef(beginCell().storeAddress(params.senderAddress).endCell())
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
