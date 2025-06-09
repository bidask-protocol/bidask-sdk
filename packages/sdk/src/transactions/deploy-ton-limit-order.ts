import { Address, beginCell, Cell, toNano } from '@ton/ton'

import type { TxParams } from '../types'
import { greatestCommonDivisor } from '../utils/math'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for deploying a TON limit order
 * @param params - Order parameters
 * @param params.poolAddress - Address of the limit pool
 * @param params.salt - Salt for shard brute-forcing
 * @param params.sellAmount - Amount of TON to sell
 * @param params.buyAmount - Amount of tokens to buy
 * @param params.reward - Reward in TON for executors
 * @param params.finalPayload - Optional final payload cell
 * @param params.expirationTimestamp - Expiration timestamp in seconds (default: no expiration)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createDeployTonLimitOrderTxParams(params: {
  poolAddress: Address
  salt: bigint
  sellAmount: bigint
  buyAmount: bigint
  reward: bigint
  finalPayload?: Cell
  expirationTimestamp?: number
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId(), expirationTimestamp = Number.MAX_SAFE_INTEGER } = params

  // reduce price fraction
  const gcd = greatestCommonDivisor(params.buyAmount, params.sellAmount)
  const factor = params.buyAmount / gcd
  const base = params.sellAmount / gcd

  const constantGas = toNano('1')

  const totalValue = constantGas + params.reward + params.sellAmount

  const body = beginCell()
    .storeUint(0xa05f9758, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.sellAmount)
    .storeUint(params.salt, 64)
    .storeUint(factor, 128)
    .storeUint(base, 128)
    .storeUint(expirationTimestamp, 64)
    .storeMaybeRef(params.finalPayload)
    .endCell()

  return {
    to: params.poolAddress,
    value: totalValue,
    payload: body,
  }
}
