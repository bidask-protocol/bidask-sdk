import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialExecutionParams } from '../types/swap'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for swapping TON using a pool
 * @deprecated Use createTonSwapV2TxParams instead
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of TON to swap
 * @param params.receiverAddress - Address of the swap result receiver
 * @param params.senderAddress - Address of the swap sender
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.exactOut - Exact amount of tokens to receive (optional, defaults to 0)
 * @param params.allowPartial - Allow partial swap execution if true, require exact amount if false
 * @param params.sqrtX128LastPrice - Last price in sqrt price X 2^128 format (required if `allowPartial` is true)
 * @param params.minAmountToReceive - Minimum amount of tokens to receive (required if `allowPartial` is false)
 * @param params.forwardPayload - Optional forward payload for the transaction
 * @param params.rejectPayload - Optional reject payload for the transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.swapGasAmount - Optional swap gas amount (defaults to 0.5 TON)
 * @returns Transaction parameters
 */
export function createTonSwapTxParams(
  params: {
    amountIn: bigint
    receiverAddress: Address
    senderAddress: Address
    poolAddress: Address
    exactOut?: bigint
    queryId?: bigint
    forwardPayload?: Cell
    rejectPayload?: Cell
    swapGasAmount?: bigint
  } & SwapPartialExecutionParams,
): TxParams {
  const { exactOut = 0n, queryId = generateRandomQueryId(), swapGasAmount = toNano('0.5'), } = params

  let payloadBuilder = beginCell()
    .storeUint(PoolContract.Opcodes.Swap, 32) // Opcode
    .storeUint(queryId, 64) // Query ID
    .storeCoins(params.amountIn) // TON amount in
    .storeAddress(params.receiverAddress) // Receiver address
    .storeBit(params.allowPartial) // Allow partial swap

  if (params.allowPartial) {
    payloadBuilder = payloadBuilder.storeUint(params.sqrtX128LastPrice, 256) // Last price
  } else {
    payloadBuilder = payloadBuilder.storeCoins(params.minAmountToReceive) // Minimum amount to receive
  }

  const payloadCell = payloadBuilder
    .storeCoins(exactOut) // Exact output
    .storeAddress(null) // Referral address
    .storeMaybeRef(beginCell().storeAddress(params.senderAddress).endCell()) // Sender address
    .storeMaybeRef(params.rejectPayload) // Reject payload
    .storeMaybeRef(params.forwardPayload) // Forward payload
    .endCell()

  return {
    to: params.poolAddress,
    value: params.amountIn + swapGasAmount,
    payload: payloadCell,
  }
}
