import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for providing single-side TON liquidity to a DAMM pool
 * @param params - Parameters for the transaction
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
export function createProvideTonSinglesideLiquidityDammTxParams(params: {
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

  const payload = beginCell()
    .storeUint(0x729c04c8, 32) // DepositTonSingleSide opcode
    .storeUint(queryId, 64)
    .storeCoins(params.tonAmount)
    .storeAddress(receiverAddress)
    .storeBit(lockLiquidity)
    .storeMaybeRef(params.rejectPayload)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return {
    to: params.poolAddress,
    value: params.tonAmount + providingGas,
    payload,
  }
}
