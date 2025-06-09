import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract } from '../contracts'
import type { TxParams } from '../types'
import { greatestCommonDivisor } from '../utils/math'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for deploying a jetton limit order
 * @param params - Order parameters
 * @param params.poolAddress - Address of the limit pool
 * @param params.sellJettonWalletAddress - Address of the sender's jetton wallet
 * @param params.senderAddress - Address of the order sender
 * @param params.salt - Salt for shard brute-forcing
 * @param params.sellAmount - Amount of jettons to sell
 * @param params.buyAmount - Amount of tokens to buy
 * @param params.reward - Reward in TON for executors
 * @param params.finalPayload - Optional final payload cell
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.expirationTimestamp - Expiration timestamp in seconds (default: no expiration)
 * @returns Transaction parameters
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
  const { queryId = generateRandomQueryId(), expirationTimestamp = Number.MAX_SAFE_INTEGER } = params

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
