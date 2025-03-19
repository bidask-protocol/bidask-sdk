import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { TxParams } from '../types'

export function createJettonSwapTxParams(params: {
  amountIn: bigint
  tokenIn: Address
  receiverAddress: Address
  senderAddress: Address
  exactOut?: bigint
  jettonWalletAddress: Address
  lastPrice: bigint
  poolAddress: Address
}): TxParams {
  const { exactOut = 0n } = params

  const forwardPayload = beginCell()
    .storeUint(PoolContract.Opcodes.Swap, 32)
    .storeAddress(params.receiverAddress)
    .storeUint(params.lastPrice, 256)
    .storeCoins(exactOut)
    .storeAddress(null)
    .storeBit(0)
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
    .storeCoins(toNano(0.13))
    .storeMaybeRef(forwardPayload)
    .endCell()

  const constantGas = toNano('1')

  return {
    to: params.jettonWalletAddress,
    value: constantGas,
    payload: jettonTransferBody,
  }
}
