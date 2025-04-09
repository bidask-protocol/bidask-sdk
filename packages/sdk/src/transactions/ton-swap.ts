import { Address, beginCell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialParams } from '../types/transactions'

export function createTonSwapTxParams(
  params: {
    amountIn: bigint
    receiverAddress: Address
    senderAddress: Address
    poolAddress: Address
    exactOut?: bigint
  } & SwapPartialParams,
): TxParams {
  const { exactOut = 0n } = params

  let payloadBuilder = beginCell()
    .storeUint(PoolContract.Opcodes.Swap, 32) // Opcode
    .storeUint(0, 64) // Query ID
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

  const constantGas = toNano('5')

  return {
    to: params.poolAddress,
    value: params.amountIn + constantGas,
    payload: payloadCell,
  }
}
