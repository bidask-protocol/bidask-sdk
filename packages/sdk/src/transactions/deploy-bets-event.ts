import { Address, beginCell, toNano } from '@ton/ton'

import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for deploying a new betting event (BetEvent)
 * @param params - Parameters for the transaction
 * @param params.betEventsMasterAddress - Address of the BetEventsMaster contract
 * @param params.outcomesAmount - Number of possible outcomes for the betting event
 * @param params.timestampEndBets - Unix timestamp when betting ends
 * @param params.comission - Commission percentage (in basis points or similar unit)
 * @param params.gasAmount - Optional amount of TON to send (defaults to 0.1 TON)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export const createDeployBetEventTxParams = (params: {
  betEventsMasterAddress: Address
  outcomesAmount: number
  timestampEndBets: number
  comission: bigint
  gasAmount?: bigint
  queryId?: bigint
}): TxParams => {
  const { gasAmount = toNano('0.1'), queryId = generateRandomQueryId() } = params

  const payload = beginCell()
    .storeUint(0x72817828, 32)
    .storeUint(queryId, 64)
    .storeUint(params.outcomesAmount, 16)
    .storeUint(params.timestampEndBets, 64)
    .storeUint(params.comission, 16)
    .endCell()

  return {
    to: params.betEventsMasterAddress,
    value: gasAmount,
    payload,
  }
}
