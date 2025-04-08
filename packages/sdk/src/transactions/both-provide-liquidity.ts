import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { LiquidityType, TxParams } from '../types'
import { LiquidityProvideBins } from '../types/liquidity'
import { createLiquidityProvideDict } from '../utils/liquidity/dictionary'

export function createProvideNativeLiquidityTxParams(params: {
  tonAmount: bigint
  jettonAmount: bigint
  jettonWalletAddress: Address
  liquidityType: LiquidityType
  binsToProvide: LiquidityProvideBins
  senderAddress: Address
  poolAddress: Address
  rejectPayload?: Cell
  forwardPayload?: Cell
}): TxParams {
  if (
    params.liquidityType === LiquidityType.OneSide &&
    params.jettonAmount > 0n &&
    params.tonAmount > 0n
  ) {
    throw new Error('Cannot send both tokens on OneSide liquidity type')
  }

  const constantGas = toNano('6')

  const onlyTon = params.jettonAmount === 0n

  const opCode = onlyTon ? PoolContract.Opcodes.AddLiquidity : PoolContract.Opcodes.AddBothLiquidity

  let forwardPayload = beginCell().storeUint(opCode, 32)

  // Add queryId to forwardPayload if only TON is provided
  if (onlyTon) {
    forwardPayload = forwardPayload.storeUint(0, 64)
  }

  const endedForwardPayload = forwardPayload
    .storeCoins(params.tonAmount)
    .storeUint(params.liquidityType, 4)
    .storeDict(createLiquidityProvideDict(params.binsToProvide))
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  if (onlyTon) {
    return {
      to: params.poolAddress,
      value: constantGas + params.tonAmount,
      payload: endedForwardPayload,
    }
  }

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(0, 64)
    .storeCoins(params.jettonAmount)
    .storeAddress(params.poolAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(params.tonAmount + constantGas / 2n)
    .storeMaybeRef(endedForwardPayload)
    .endCell()

  return {
    to: params.jettonWalletAddress,
    value: constantGas + params.tonAmount,
    payload: jettonTransferBody,
  }
}
