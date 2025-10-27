import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialExecutionParams } from '../types/swap'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for swapping TON using a pool (v2)
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of TON to swap
 * @param params.receiverAddress - Optional address of the swap result receiver (defaults to senderAddress)
 * @param params.senderAddress - Address of the swap sender
 * @param params.refundAddress - Optional address of the refund address (defaults to senderAddress)
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.exactOut - Exact amount of tokens to receive (defaults to 0)
 * @param params.allowPartial - Allow partial swap execution if true, require exact amount if false
 * @param params.sqrtX128LastPrice - Last price in sqrt price X 2^128 format (required if `allowPartial` is true)
 * @param params.minAmountToReceive - Minimum amount of tokens to receive (required if `allowPartial` is false)
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.rejectPayload - Optional reject payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.refAddress - Optional referral address
 * @param params.swapGasAmount - Optional swap gas amount (defaults to 0.5 TON)
 * @returns Transaction parameters
 */
export function createTonSwapV2TxParams(
  params: {
    amountIn: bigint
    receiverAddress?: Address
    senderAddress: Address
    refundAddress?: Address
    poolAddress: Address
    exactOut?: bigint
    queryId?: bigint
    forwardPayload?: Cell
    rejectPayload?: Cell
    refAddress?: Address
    swapGasAmount?: bigint
  } & SwapPartialExecutionParams,
): TxParams {
  const {
    exactOut = 0n,
    queryId = generateRandomQueryId(),
    refundAddress = params.senderAddress,
    receiverAddress = params.senderAddress,
    swapGasAmount = toNano('0.5'),
  } = params

  let payloadBuilder = beginCell()
    .storeUint(PoolContract.Opcodes.SwapV2, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.amountIn)
    .storeAddress(receiverAddress)
    .storeBit(params.allowPartial)

  if (params.allowPartial) {
    payloadBuilder = payloadBuilder.storeUint(params.sqrtX128LastPrice, 256)
  } else {
    payloadBuilder = payloadBuilder.storeCoins(params.minAmountToReceive)
  }

  payloadBuilder = payloadBuilder.storeCoins(exactOut)

  const additionalDataBuilder = beginCell().storeAddress(refundAddress)

  if (params.refAddress) {
    additionalDataBuilder.storeAddress(params.refAddress)
  } else {
    additionalDataBuilder.storeUint(0, 2)
  }

  payloadBuilder = payloadBuilder.storeMaybeRef(additionalDataBuilder.endCell())

  const payloadCell = payloadBuilder
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return {
    to: params.poolAddress,
    value: params.amountIn + swapGasAmount,
    payload: payloadCell,
  }
}
