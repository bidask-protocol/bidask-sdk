import { Address, beginCell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialExecutionParams } from '../types/swap'
import { generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for swapping TON using a pool
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of TON to swap
 * @param params.receiverAddress - Address of the receiver
 * @param params.senderAddress - Address of the sender
 * @param params.poolAddress - Address of the pool
 * @param params.queryId - Optional query ID for the transaction (defaults to 0)
 */
export function createTonSwapTxParams(
  params: {
    amountIn: bigint
    receiverAddress: Address
    senderAddress: Address
    poolAddress: Address
    exactOut?: bigint
    queryId?: bigint
  } & SwapPartialExecutionParams,
): TxParams {
  const { exactOut = 0n, queryId = generateRandomQueryId() } = params

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
    .storeMaybeRef(null) // Reject payload
    .storeMaybeRef(null) // Forward payload
    .endCell()

  const constantGas = toNano('0.5')

  return {
    to: params.poolAddress,
    value: params.amountIn + constantGas,
    payload: payloadCell,
  }
}
