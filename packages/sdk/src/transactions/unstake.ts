import { Address, beginCell, toNano } from '@ton/ton';
import { TxParams } from '../types';
import { generateRandomQueryId } from '../utils';

/**
 * Creates transaction parameters for unstaking (claiming rewards) from a farming position.
 * Sends a `NFTGetFarmings` message to the farming position NFT which must include at least 0.15 TON.
 *
 * @param params.farmingPositionAddress - Address of the farming position (NFT item)
 * @param params.senderAddress          - Address of the transaction sender
 * @param params.forwardAmount?         - Optional TON to attach (default 0.15 TON)
 * @param params.queryId?               - Optional query ID (random if omitted)
 * @returns TxParams ready to be sent via the SDK
 */
export function createUnstakeTxParams(params: {
  farmingPositionAddress: Address
  senderAddress: Address
  forwardAmount?: bigint
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId(), forwardAmount = toNano('0.15') } = params

  const unstakePayload = beginCell()
    .storeUint(0x1ed2b57a, 32) // NFTGetFarmings opcode
    .storeUint(queryId, 64)
    .endCell()

  return {
    to: params.farmingPositionAddress,
    value: forwardAmount,
    payload: unstakePayload,
  }
}