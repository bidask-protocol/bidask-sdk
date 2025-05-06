import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { LiquidityType, TxParams } from '../types'
import { DepositType, LiquidityProvideBins } from '../types/liquidity'
import { createLiquidityProvideDict } from '../utils/liquidity/dictionary'

/**
 * Creates a transaction parameters for providing liquidity to a TON/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.tonAmount - Amount of TON to provide
 * @param params.jettonAmount - Amount of token to provide
 * @param params.jettonWalletAddress - Address of the token Jetton wallet
 * @param params.depositType - Type of deposit
 * @param params.liquidityType - Type of liquidity
 * @param params.binsToProvide - Bins to provide
 * @param params.senderAddress - Address of the sender
 * @param params.poolAddress - Address of the pool
 * @param params.rejectPayload - Reject payload
 * @param params.forwardPayload - Forward payload
 * @returns Transaction parameters
 */
export function createProvideTonLiquidityTxParams(params: {
  tonAmount: bigint
  jettonAmount: bigint
  jettonWalletAddress: Address
  depositType: DepositType
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

  const constantGas = toNano('3')

  const onlyTon = params.jettonAmount === 0n

  const opCode = onlyTon ? PoolContract.Opcodes.AddLiquidity : PoolContract.Opcodes.AddBothLiquidity

  let forwardPayloadBuilder = beginCell().storeUint(opCode, 32)

  // Add queryId to forwardPayload if only TON is provided
  if (onlyTon) {
    forwardPayloadBuilder = forwardPayloadBuilder.storeUint(0, 64)
  }

  const forwardPayloadCell = forwardPayloadBuilder
    .storeCoins(params.tonAmount)
    .storeUint(params.depositType, 3)
    .storeUint(params.liquidityType, 1)
    .storeDict(createLiquidityProvideDict(params.binsToProvide))
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  if (onlyTon) {
    return {
      to: params.poolAddress,
      value: constantGas + params.tonAmount,
      payload: forwardPayloadCell,
    }
  }

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(0, 64)
    .storeCoins(params.jettonAmount)
    .storeAddress(params.poolAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(params.tonAmount + constantGas)
    .storeMaybeRef(forwardPayloadCell)
    .endCell()

  return {
    to: params.jettonWalletAddress,
    value: constantGas + constantGas + params.tonAmount,
    payload: jettonTransferBody,
  }
}
