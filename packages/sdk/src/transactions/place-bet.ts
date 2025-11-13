import { Address, beginCell, toNano } from '@ton/ton'

import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for placing a bet on a specific outcome
 * @param params - Parameters for the transaction
 * @param params.betEventAddress - Address of the BetEvent contract
 * @param params.nativeAmount - Amount of TON to bet (in nanoTON)
 * @param params.outcome - The outcome number to bet on
 * @param params.gasAmount - Optional gas amount for the transaction (defaults to 0.1 TON)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export const createPlaceBetTxParams = (params: {
  betEventAddress: Address
  nativeAmount: bigint
  outcome: number
  gasAmount?: bigint
  queryId?: bigint
}): TxParams => {
  const { gasAmount = toNano('0.1'), queryId = generateRandomQueryId() } = params

  const payload = beginCell()
    .storeUint(0x7281f829, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.nativeAmount)
    .storeUint(params.outcome, 16)
    .endCell()

  return {
    to: params.betEventAddress,
    value: gasAmount + params.nativeAmount,
    payload,
  }
}
