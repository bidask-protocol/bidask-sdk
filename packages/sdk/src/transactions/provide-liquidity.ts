import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { LiquidityType, TxParams } from '../types'
import { DepositType, LiquidityProvideBins } from '../types/liquidity'
import { getRangeByBin } from '../utils'
import { createLiquidityProvideDict, divideBinsIntoBatches } from '../utils/liquidity/dictionary'

/**
 * Creates a transaction parameters for providing liquidity to a Jetton/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.jettonWalletAddress0 - Address of the token0 Jetton wallet
 * @param params.jettonWalletAddress1 - Address of the token1 Jetton wallet
 * @param params.senderAddress - Address of the sender
 * @param params.liquidityType - Type of liquidity
 * @param params.binsToProvide - Bins to provide
 * @param params.poolAddress - Address of the pool
 * @param params.rejectPayload - Reject payload
 * @param params.forwardPayload - Forward payload
 * @param params.initializedRanges - Ranges that are already initialized
 * @returns Transactions parameters
 */
export function createProvideLiquidityTxParams(params: {
  jettonWalletAddress0: Address
  jettonWalletAddress1: Address
  senderAddress: Address
  binsToProvide: LiquidityProvideBins
  poolAddress: Address
  initializedRanges: number[]
  rejectPayload?: Cell
  forwardPayload?: Cell
}): TxParams[] {
  const messages: TxParams[] = []

  const batches = divideBinsIntoBatches(params.binsToProvide)

  // Create messages for each bin group
  batches.forEach((binGroup) => {
    let jettonAmount0 = 0n
    let jettonAmount1 = 0n
    Object.values(binGroup).forEach(([x, y]) => {
      jettonAmount0 += x
      jettonAmount1 += y
    })

    const liquidityType =
      jettonAmount0 > 0n && jettonAmount1 > 0n ? LiquidityType.TwoSides : LiquidityType.OneSide

    const rangeNumber = getRangeByBin(Number(Object.keys(binGroup)[0]))

    const depositType = params.initializedRanges.includes(rangeNumber)
      ? DepositType.Add
      : DepositType.Initial

    const forwardPayload = beginCell()
      .storeUint(PoolContract.Opcodes.AddLiquidity, 32)
      .storeUint(depositType, 3)
      .storeUint(liquidityType, 1)
      .storeDict(createLiquidityProvideDict(binGroup))
      .storeMaybeRef(params.rejectPayload)
      .storeMaybeRef(params.forwardPayload)
      .endCell()

    const providingGas = calculateGas(Object.keys(binGroup).length)
    const jettonTransferGas = toNano('0.2')

    if (jettonAmount0 > 0n) {
      const jettonTransferBody0 = beginCell()
        .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
        .storeUint(0, 64)
        .storeCoins(jettonAmount0)
        .storeAddress(params.poolAddress)
        .storeAddress(params.senderAddress)
        .storeMaybeRef(Cell.EMPTY)
        .storeCoins(providingGas)
        .storeMaybeRef(forwardPayload)
        .endCell()

      messages.push({
        to: params.jettonWalletAddress0,
        value: providingGas + jettonTransferGas,
        payload: jettonTransferBody0,
      })
    }

    if (jettonAmount1 > 0n) {
      const jettonTransferBody1 = beginCell()
        .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
        .storeUint(0, 64)
        .storeCoins(jettonAmount1)
        .storeAddress(params.poolAddress)
        .storeAddress(params.senderAddress)
        .storeMaybeRef(Cell.EMPTY)
        .storeCoins(providingGas)
        .storeMaybeRef(forwardPayload)
        .endCell()

      messages.push({
        to: params.jettonWalletAddress1,
        value: providingGas + jettonTransferGas,
        payload: jettonTransferBody1,
      })
    }
  })

  return messages
}

const calculateGas = (binsAmount: number): bigint => {
  return toNano('0.8') + BigInt(binsAmount) * toNano('0.004')
}
