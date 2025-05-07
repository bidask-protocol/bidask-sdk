import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialExecutionParams } from '../types/swap'

/**
 * Creates a transaction parameters for swapping tokens using a Jetton wallet
 * @param params - Parameters for the transaction
 * @param params.amountIn - Amount of tokens to swap
 * @param params.tokenIn - Address of the token to swap
 * @param params.receiverAddress - Address of the receiver
 * @param params.senderAddress - Address of the sender
 * @param params.exactOut - Exact amount of tokens to receive
 * @param params.jettonWalletAddress - Address of the Jetton wallet
 * @param params.poolAddress - Address of the pool
 * @param params.allowPartial - Allow partial swap execution
 * @param params.sqrtX128LastPrice - Last price in sqrt price X 2^128 format (required if `allowPartial` is true)
 * @param params.minAmountToReceive - Minimum amount of tokens to receive (required if `allowPartial` is false)
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
  } & SwapPartialExecutionParams,
): TxParams {
  const { exactOut = 0n } = params

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
    .storeMaybeRef(null)
    .storeMaybeRef(null)
    .endCell()

  const transferGas = toNano(0.2)

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(0, 64)
    .storeCoins(params.amountIn)
    .storeAddress(params.poolAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(transferGas)
    .storeMaybeRef(forwardPayloadCell)
    .endCell()

  const constantGas = toNano('0.5')

  return {
    to: params.jettonWalletAddress,
    value: constantGas + transferGas,
    payload: jettonTransferBody,
  }
}
