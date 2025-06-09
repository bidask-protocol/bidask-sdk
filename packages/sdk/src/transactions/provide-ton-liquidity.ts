import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../contracts'
import { LiquidityType, TxParams } from '../types'
import { DepositType, LiquidityProvideBins } from '../types/liquidity'
import { generateRandomQueryId, getRangeByBin } from '../utils'
import { createLiquidityProvideDict, divideBinsIntoBatches } from '../utils/liquidity/dictionary'

/**
 * Creates transaction parameters for providing liquidity to a TON/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.jettonWalletAddress - Address of the jetton wallet
 * @param params.binsToProvide - Bins with amounts to provide liquidity for
 * @param params.senderAddress - Address of the liquidity provider
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.initializedRanges - Array of range numbers that are already initialized
 * @param params.rejectPayload - Optional payload for transaction rejection
 * @param params.forwardPayload - Optional payload for successful transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Array of transaction parameters
 */
export function createProvideTonLiquidityTxParams(params: {
  jettonWalletAddress: Address
  binsToProvide: LiquidityProvideBins
  senderAddress: Address
  poolAddress: Address
  initializedRanges: number[]
  rejectPayload?: Cell
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams[] {
  const { queryId = generateRandomQueryId() } = params
  const messages: TxParams[] = []

  const batches = divideBinsIntoBatches(params.binsToProvide)

  batches.forEach((binGroup) => {
    let jettonAmount = 0n
    let tonAmount = 0n
    Object.values(binGroup).forEach(([x, y]) => {
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
      forwardPayloadBuilder = forwardPayloadBuilder.storeUint(queryId, 64)
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
        .storeUint(queryId, 64)
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
  return toNano('0.8') + BigInt(binsAmount) * toNano('0.004')
}
