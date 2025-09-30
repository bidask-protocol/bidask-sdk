import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates transaction parameters for providing liquidity to a DAMM TON/Jetton pool
 * @param params - Parameters for the transaction
 * @param params.jettonWalletAddress - Address of the jetton wallet (required if providing jettons)
 * @param params.jettonAmount - Amount of jettons to provide
 * @param params.tonAmount - Amount of TON to provide
 * @param params.senderAddress - Address of the liquidity provider
 * @param params.poolAddress - Address of the liquidity pool
 * @param params.receiverAddress - Address to receive liquidity tokens (defaults to senderAddress)
 * @param params.lockLiquidity - Whether to lock the liquidity
 * @param params.rejectPayload - Optional payload for transaction rejection
 * @param params.forwardPayload - Optional payload for successful transaction
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createProvideTonLiquidityDammTxParams(params: {
  jettonWalletAddress: Address
  jettonAmount: bigint
  tonAmount: bigint
  senderAddress: Address
  poolAddress: Address
  receiverAddress?: Address
  lockLiquidity?: boolean
  rejectPayload?: Cell
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const {
    queryId = generateRandomQueryId(),
    receiverAddress = params.senderAddress,
    lockLiquidity = false,
  } = params

  const providingGas = toNano('0.5')

  const forwardPayload = beginCell()
    .storeUint(0xa8904134, 32) // DepositBoth opcode
    .storeCoins(params.tonAmount)
    .storeAddress(receiverAddress)
    .storeBit(lockLiquidity)
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return createTransferJettonTxParams({
    jettonWalletAddress: params.jettonWalletAddress!,
    receiverAddress: params.poolAddress,
    amount: params.jettonAmount,
    senderAddress: params.senderAddress,
    forwardPayload,
    forwardAmount: params.tonAmount + providingGas,
    queryId,
  })
}
