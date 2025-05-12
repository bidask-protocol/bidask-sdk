import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract } from '../contracts'
import type { TxParams } from '../types'
import { greatestCommonDivisor } from '../utils/math'

/**
 * Creates transaction parameters for creating a limit order pool
 * It actually creates a limit order within a limit pool
 * @param params - Order parameters
 * @param params.pool - Address of the limit pool
 * @param params.salt - Salt for shard brute-forcing
 * @param params.sellAmount - Amount of X to sell
 * @param params.buyAmount - Amount of Y to buy
 * @param params.reward - Reward in TON for executors
 * @param params.finalPayload - Optional final payload cell
 * @param params.queryId - Query ID (default: 0n)
 * @param params.expirationTimestamp - Expiration timestamp in seconds (default: no expiration)
 */
export function createDeployJettonLimitOrderTxParams(params: {
  poolAddress: Address
  sellJettonWalletAddress: Address
  salt: bigint
  sellAmount: bigint
  buyAmount: bigint
  reward: bigint
  senderAddress: Address
  expirationTimestamp?: number
  finalPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = 0n, expirationTimestamp = Number.MAX_SAFE_INTEGER } = params

  const gcd = greatestCommonDivisor(params.buyAmount, params.sellAmount)
  const factor = params.buyAmount / gcd
  const base = params.sellAmount / gcd

  const constantGas = toNano('0.2')

  const forwardGas = constantGas + params.reward

  const forwardPayloadCell = beginCell()
    .storeUint(0xa05f9758, 32)
    .storeUint(params.salt, 64)
    .storeUint(factor, 128)
    .storeUint(base, 128)
    .storeUint(expirationTimestamp, 64)
    .storeMaybeRef(params.finalPayload)
    .endCell()

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.sellAmount)
    .storeAddress(params.poolAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(forwardGas)
    .storeMaybeRef(forwardPayloadCell)
    .endCell()

  return {
    to: params.sellJettonWalletAddress,
    value: forwardGas + constantGas,
    payload: jettonTransferBody,
  }
}
