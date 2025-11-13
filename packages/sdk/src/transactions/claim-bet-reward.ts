import { Address, beginCell, toNano } from '@ton/ton'

import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for claiming bet rewards
 * @param params - Parameters for the transaction
 * @param params.betAddress - Address of the bet contract to claim rewards from
 * @param params.value - Optional amount of TON to send for gas (defaults to 0.1 TON)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export const createClaimBetRewardTxParams = (params: {
  betAddress: Address
  value?: bigint
  queryId?: bigint
}): TxParams => {
  const { value = toNano('0.1'), queryId = generateRandomQueryId() } = params

  const payload = beginCell().storeUint(0x9181a827, 32).storeUint(queryId, 64).endCell()

  return {
    to: params.betAddress,
    value,
    payload,
  }
}
