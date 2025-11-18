import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { MEME_FACTORY_ADDRESS } from '../constants'
import { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * Creates transaction parameters for deploying a farming (staking) contract
 * via the memefactory **using a jetton transfer**.
 *
 * @param params.factoryAddress          – Address of the memefactory contract (optional, defaults to MEME_FACTORY_ADDRESS)
 * @param params.userAddress            – Address of the user deploying the farm
 * @param params.senderAddress          – Address of the sender (default is userAddress)
 * @param params.seed                    – Seed cell (unchanged after deployment)
 * @param params.farmingTokenWallet      – Jetton wallet address for the farming token
 * @param params.lpTokenWallet           – Jetton wallet address for the LP token (used for transfer)
 * @param params.jettonAmount            – Amount of farming jettons to transfer
 * @param params.endOfFarming            – End of farming timestamp (uint64)
 * @param params.refundAddress           – Address for refunds
 * @param params.forwardAmount?         – Optional TON to attach (default 1.1 TON)
 * @param params.queryId?               – Optional query ID (random if omitted)
 * @returns TxParams ready to be sent via the SDK
 */
export function createDeployFarmingTxParams(params: {
  factoryAddress?: Address
  userAddress: Address
  senderAddress?: Address
  jettonWalletAddress: Address
  seed: Cell
  farmingTokenWallet: Address
  lpTokenWallet: Address
  jettonAmount: bigint
  endOfFarming: bigint
  refundAddress: Address
  forwardAmount?: bigint
  queryId?: bigint
}): TxParams {
  const {
    queryId = generateRandomQueryId(),
    forwardAmount = toNano('1.1'),
    factoryAddress = MEME_FACTORY_ADDRESS,
    senderAddress = params.userAddress,
  } = params

  // Build the increaseFarming cell
  const increaseFarmingInfo = beginCell()
    .storeUint(0x50916472, 32) // Factory_FarmingDeployData opcode (increaseFarming)
    .storeUint(params.endOfFarming, 64)
    .storeAddress(params.refundAddress)
    .endCell()

  // Build the payload expected by the memefactory
  const farmingPayload = beginCell()
    .storeRef(params.seed)
    .storeAddress(params.farmingTokenWallet)
    .storeAddress(params.lpTokenWallet)
    .storeRef(increaseFarmingInfo)
    .endCell()

  // Wrap the payload in a jetton transfer (farming token)
  return createTransferJettonTxParams({
    jettonWalletAddress: params.jettonWalletAddress,
    receiverAddress: factoryAddress,
    amount: params.jettonAmount,
    senderAddress,
    forwardAmount,
    forwardPayload: farmingPayload,
    queryId,
  })
}
