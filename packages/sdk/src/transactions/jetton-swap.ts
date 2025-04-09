import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { TxParams } from '../types'
import { SwapPartialParams } from '../types/transactions'

export function createJettonSwapTxParams(
  params: {
    amountIn: bigint
    tokenIn: Address
    receiverAddress: Address
    senderAddress: Address
    exactOut?: bigint
    jettonWalletAddress: Address
    poolAddress: Address
  } & SwapPartialParams,
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

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(0, 64)
    .storeCoins(params.amountIn)
    .storeAddress(params.poolAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(toNano(0.5))
    .storeMaybeRef(forwardPayloadCell)
    .endCell()

  const constantGas = toNano('2')

  return {
    to: params.jettonWalletAddress,
    value: constantGas,
    payload: jettonTransferBody,
  }
}
