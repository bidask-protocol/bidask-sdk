import { Address, beginCell, toNano } from '@ton/ton';
import { TxParams } from '../types';
import { generateRandomQueryId } from '../utils';
import { createTransferJettonTxParams } from './transfer-jetton';

/**
 * Creates transaction parameters for staking (starting farming) by sending LP jettons
 * to the farming contract with a `startFarmingRequest` payload.
 *
 * @param params.farmingContractAddress - Address of the farming contract
 * @param params.lpJettonWalletAddress   - Jetton wallet address of the LP token
 * @param params.amount                  - Amount of LP jettons to stake
 * @param params.senderAddress           - Address of the transaction sender
 * @param params.itemIndex               - NFT index (0 for new, otherwise existing)
 * @param params.farmingRecipient        - Address that will receive farming rewards
 * @param params.forwardAmount?          - Optional extra TON to forward (default 0.15 TON)
 * @param params.queryId?                - Optional query ID (random if omitted)
 * @returns TxParams ready to be sent via the SDK
 */
export function createStakeTxParams(params: {
  farmingContractAddress: Address;
  lpJettonWalletAddress: Address;
  amount: bigint;
  senderAddress: Address;
  itemIndex: bigint;
  farmingRecipient: Address;
  forwardAmount?: bigint;
  queryId?: bigint;
}): TxParams {
  const { queryId = generateRandomQueryId(), forwardAmount = toNano('0.15') } = params;

  const stakePayload = beginCell()
    .storeUint(0xd0e1d6dd, 32) // startFarmingRequest opcode
    .storeUint(params.itemIndex, 64)
    .storeAddress(params.farmingRecipient)
    .endCell();

  return createTransferJettonTxParams({
    jettonWalletAddress: params.lpJettonWalletAddress,
    receiverAddress: params.farmingContractAddress,
    amount: params.amount,
    senderAddress: params.senderAddress,
    forwardPayload: stakePayload,
    forwardAmount,
    queryId,
  });
}