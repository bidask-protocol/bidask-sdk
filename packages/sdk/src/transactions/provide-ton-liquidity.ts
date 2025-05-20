import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { LiquidityType, TxParams } from '../types'
import { DepositType, LiquidityProvideBins } from '../types/liquidity'
import { getRangeByBin } from '../utils'
import { createLiquidityProvideDict, divideBinsIntoBatches } from '../utils/liquidity/dictionary'

/**
 * Creates a transaction parameters for providing liquidity to a TON/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.jettonWalletAddress - Address of the token Jetton wallet
 * @param params.depositType - Type of deposit
 * @param params.liquidityType - Type of liquidity
 * @param params.binsToProvide - Bins to provide
 * @param params.senderAddress - Address of the sender
 * @param params.poolAddress - Address of the pool
 * @param params.rejectPayload - Reject payload
 * @param params.forwardPayload - Forward payload
 * @returns Transactions parameters
 */
export function createProvideTonLiquidityTxParams(params: {
  jettonWalletAddress: Address
  binsToProvide: LiquidityProvideBins
  senderAddress: Address
  poolAddress: Address
  initializedRanges: number[]
  rejectPayload?: Cell
  forwardPayload?: Cell
}): TxParams[] {
  const messages: TxParams[] = []

  const batches = divideBinsIntoBatches(params.binsToProvide)

  batches.forEach((binGroup) => {
    let jettonAmount = 0n
    let tonAmount = 0n
    Object.values(params.binsToProvide).forEach(([x, y]) => {
      jettonAmount += x
      tonAmount += y
    })

    const providingGas = calculateGas(Object.keys(binGroup).length)

    const onlyTon = jettonAmount === 0n

    const opCode = onlyTon
      ? PoolContract.Opcodes.AddLiquidity
      : PoolContract.Opcodes.AddBothLiquidity

    let forwardPayloadBuilder = beginCell().storeUint(opCode, 32)

    // Add queryId to forwardPayload if only TON is provided
    if (onlyTon) {
      forwardPayloadBuilder = forwardPayloadBuilder.storeUint(0, 64)
    }

    const liquidityType =
      jettonAmount > 0n && tonAmount > 0n ? LiquidityType.TwoSides : LiquidityType.OneSide

    const rangeNumber = getRangeByBin(Number(Object.keys(binGroup)[0]))

    const depositType = params.initializedRanges.includes(rangeNumber)
      ? DepositType.Add
      : DepositType.Initial

    const forwardPayloadCell = forwardPayloadBuilder
      .storeCoins(tonAmount)
      .storeUint(depositType, 3)
      .storeUint(liquidityType, 1)
      .storeDict(createLiquidityProvideDict(binGroup))
      .storeMaybeRef(params.rejectPayload)
      .storeMaybeRef(params.forwardPayload)
      .endCell()

    if (onlyTon) {
      messages.push({
        to: params.poolAddress,
        value: providingGas + tonAmount,
        payload: forwardPayloadCell,
      })
    } else {
      const jettonTransferBody = beginCell()
        .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
        .storeUint(0, 64)
        .storeCoins(jettonAmount)
        .storeAddress(params.poolAddress)
        .storeAddress(params.senderAddress)
        .storeMaybeRef(Cell.EMPTY)
        .storeCoins(tonAmount + providingGas)
        .storeMaybeRef(forwardPayloadCell)
        .endCell()

      const jettonTransferGas = toNano('0.2')

      messages.push({
        to: params.jettonWalletAddress,
        value: providingGas + jettonTransferGas + tonAmount,
        payload: jettonTransferBody,
      })
    }
  })

  return messages
}

const calculateGas = (binsAmount: number): bigint => {
  return toNano('0.4') + BigInt(binsAmount) * toNano('0.004')
}
