import { Address, beginCell, toNano } from '@ton/ton'

import { PoolContract } from '../contracts'
import { TxParams } from '../types'

export function createTonSwapTxParams(params: {
  amountIn: bigint
  receiverAddress: Address
  lastPrice: bigint
  poolAddress: Address
  exactOut?: bigint
}): TxParams {
  const { exactOut = 0n } = params

  const payload = beginCell()
    .storeUint(PoolContract.Opcodes.Swap, 32)
    .storeUint(0, 64)
    .storeCoins(params.amountIn)
    .storeAddress(params.receiverAddress)
    .storeUint(params.lastPrice, 256)
    .storeCoins(exactOut)
    .storeAddress(null)
    .storeBit(0)
    .storeMaybeRef(null)
    .storeMaybeRef(null)
    .endCell()

  const constantGas = toNano('1')

  return {
    to: params.poolAddress,
    value: params.amountIn + constantGas,
    payload,
  }
}
