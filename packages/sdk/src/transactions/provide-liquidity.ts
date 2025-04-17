import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { LiquidityType, TxParams } from '../types'
import { DepositType, LiquidityProvideBins } from '../types/liquidity'
import { createLiquidityProvideDict } from '../utils/liquidity/dictionary'

/**
 * Creates a transaction parameters for providing liquidity to a Jetton/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.jettonAmount0 - Amount of token0 to provide
 * @param params.jettonAmount1 - Amount of token1 to provide
 * @param params.jettonWalletAddress0 - Address of the token0 Jetton wallet
 * @param params.jettonWalletAddress1 - Address of the token1 Jetton wallet
 * @param params.senderAddress - Address of the sender
 * @param params.depositType - Type of deposit
 * @param params.liquidityType - Type of liquidity
 * @param params.binsToProvide - Bins to provide
 * @param params.poolAddress - Address of the pool
 * @param params.rejectPayload - Reject payload
 * @param params.forwardPayload - Forward payload
 * @returns Transaction parameters
 */
export function createProvideLiquidityTxParams(params: {
  jettonAmount0: bigint
  jettonAmount1: bigint
  jettonWalletAddress0: Address
  jettonWalletAddress1: Address
  senderAddress: Address
  depositType: DepositType
  liquidityType: LiquidityType
  binsToProvide: LiquidityProvideBins
  poolAddress: Address
  rejectPayload?: Cell
  forwardPayload?: Cell
}): TxParams[] {
  if (
    params.liquidityType === LiquidityType.OneSide &&
    params.jettonAmount1 > 0n &&
    params.jettonAmount0 > 0n
  ) {
    throw new Error('Cannot send both jetton tokens on OneSide liquidity type')
  }

  const constantGas = toNano('4')

  const forwardPayload = beginCell()
    .storeUint(PoolContract.Opcodes.AddLiquidity, 32)
    .storeUint(params.depositType, 3)
    .storeUint(params.liquidityType, 1)
    .storeDict(createLiquidityProvideDict(params.binsToProvide))
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const messages: TxParams[] = []

  if (params.jettonAmount0 > 0n) {
    const jettonTransferBody0 = beginCell()
      .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
      .storeUint(0, 64)
      .storeCoins(params.jettonAmount0)
      .storeAddress(params.poolAddress)
      .storeAddress(params.senderAddress)
      .storeMaybeRef(Cell.EMPTY)
      .storeCoins(constantGas / 2n)
      .storeMaybeRef(forwardPayload)
      .endCell()

    messages.push({
      to: params.jettonWalletAddress0,
      value: constantGas,
      payload: jettonTransferBody0,
    })
  }

  if (params.jettonAmount1 > 0n) {
    const jettonTransferBody1 = beginCell()
      .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
      .storeUint(0, 64)
      .storeCoins(params.jettonAmount1)
      .storeAddress(params.poolAddress)
      .storeAddress(params.senderAddress)
      .storeMaybeRef(Cell.EMPTY)
      .storeCoins(constantGas / 2n)
      .storeMaybeRef(forwardPayload)
      .endCell()

    messages.push({
      to: params.jettonWalletAddress1,
      value: constantGas,
      payload: jettonTransferBody1,
    })
  }

  return messages
}
