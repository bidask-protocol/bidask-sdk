import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { TradeAccount } from '../contracts'
import { TxParams } from '../types'
import { generateRandomQueryId, isZeroAddress } from '../utils'
import { createTransferJettonTxParams } from './transfer-jetton'

/**
 * @internal
 * 
 * Creates a transaction parameters for depositing tokens into a trade account
 *
 * @param params - Parameters for the transaction
 * @param params.poolAddress - Address of the pool contract
 * @param params.token0UserWalletAddress - Address of the token0 user wallet
 * @param params.token1UserWalletAddress - Address of the token1 user wallet (ZERO_ADDRESS if TON)
 * @param params.token0Amount - Amount of token0 to deposit
 * @param params.token1Amount - Amount of token1 to deposit
 * @param params.userAddress - Address of the user
 * @param params.senderAddress - Address of the sender
 * @param params.publicKey - Public key of the trading account
 * @param params.seedCell - Seed cell of the trading account
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @param params.forwardPayload - Optional forward payload (triggers deposit notification to owner)
 */
export const createTradeAccountDepositTxParams = (params: {
  poolAddress: Address
  token0UserWalletAddress: Address
  token1UserWalletAddress: Address
  token0Amount: bigint
  token1Amount: bigint
  userAddress: Address
  senderAddress: Address
  publicKey: Buffer
  seedCell?: Cell
  queryId?: bigint
  forwardPayload?: Cell
}): TxParams[] => {
  const { queryId = generateRandomQueryId(), seedCell = Cell.EMPTY } = params
  const constantGas = toNano('0.1')

  const forwardPayload = beginCell()
    .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
    .storeAddress(params.userAddress)
    .storeBuffer(params.publicKey, 32)
    .storeRef(seedCell)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  const messages: TxParams[] = []

  if (params.token0Amount > 0n) {
    messages.push(
      createTransferJettonTxParams({
        jettonWalletAddress: params.token0UserWalletAddress,
        receiverAddress: params.poolAddress,
        amount: params.token0Amount,
        senderAddress: params.senderAddress,
        forwardAmount: constantGas,
        forwardPayload,
        queryId,
      }),
    )
  }

  if (params.token1Amount > 0n) {
    if (isZeroAddress(params.token1UserWalletAddress)) {
      const tonPayload = beginCell()
        .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
        .storeUint(queryId, 64)
        .storeCoins(params.token1Amount)
        .storeAddress(params.userAddress)
        .storeBuffer(params.publicKey, 32)
        .storeRef(seedCell)
        .storeMaybeRef(params.forwardPayload)
        .endCell()

      messages.push({
        to: params.poolAddress,
        value: constantGas + params.token1Amount,
        payload: tonPayload,
      })
    } else {
      messages.push(
        createTransferJettonTxParams({
          jettonWalletAddress: params.token1UserWalletAddress,
          receiverAddress: params.poolAddress,
          amount: params.token1Amount,
          senderAddress: params.senderAddress,
          forwardAmount: constantGas,
          forwardPayload,
          queryId,
        }),
      )
    }
  }

  return messages
}
