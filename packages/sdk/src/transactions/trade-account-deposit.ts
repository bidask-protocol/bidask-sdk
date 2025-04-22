import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract, TradeAccount } from '../contracts'
import { TxParams } from '../types'
import { createSeedCell, isZeroAddress } from '../utils'

/**
 * Creates a transaction parameters for depositing tokens into a trade account
 *
 * @param params - Parameters for the transaction
 * @param params.poolAddress - Address of the pool contract
 * @param params.token0UserWalletAddress - Address of the token0 user wallet
 * @param params.token1UserWalletAddress - Address of the token1 user wallet
 * @param params.token0Amount - Amount of token0 to deposit
 * @param params.token1Amount - Amount of token1 to deposit
 * @param params.userAddress - Address of the user
 * @param params.senderAddress - Address of the sender
 * @param params.publicKey - Public key of the trading account
 * @param params.seed - Seed of the trading account
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
  seed: number
}): TxParams[] => {
  const constantGas = toNano('0.5')

  const seedCell = createSeedCell(params.seed)

  const forwardPayload = beginCell()
    .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
    .storeAddress(params.userAddress)
    .storeBuffer(params.publicKey, 32)
    .storeRef(seedCell)
    .endCell()

  const messages: TxParams[] = []

  if (params.token0Amount > 0n) {
    if (isZeroAddress(params.token0UserWalletAddress)) {
      const tonPayload = beginCell()
        .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
        .storeUint(0, 64)
        .storeAddress(params.userAddress)
        .storeBuffer(params.publicKey, 32)
        .storeRef(seedCell)
        .storeCoins(params.token0Amount)
        .endCell()

      messages.push({
        to: params.poolAddress,
        value: constantGas + params.token0Amount,
        payload: tonPayload,
      })
    } else {
      const jettonPayload = beginCell()
        .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
        .storeUint(0, 64)
        .storeCoins(params.token0Amount)
        .storeAddress(params.poolAddress)
        .storeAddress(params.senderAddress)
        .storeMaybeRef(Cell.EMPTY)
        .storeCoins(constantGas / 2n)
        .storeMaybeRef(forwardPayload)
        .endCell()

      messages.push({
        to: params.token0UserWalletAddress,
        value: constantGas,
        payload: jettonPayload,
      })
    }
  }

  if (params.token1Amount > 0n) {
    if (isZeroAddress(params.token1UserWalletAddress)) {
      const tonPayload = beginCell()
        .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
        .storeUint(0, 64)
        .storeAddress(params.userAddress)
        .storeBuffer(params.publicKey, 32)
        .storeRef(seedCell)
        .storeCoins(params.token1Amount)
        .endCell()

      messages.push({
        to: params.poolAddress,
        value: constantGas + params.token1Amount,
        payload: tonPayload,
      })
    } else {
      const jettonPayload = beginCell()
        .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
        .storeUint(0, 64)
        .storeCoins(params.token1Amount)
        .storeAddress(params.poolAddress)
        .storeAddress(params.senderAddress)
        .storeMaybeRef(Cell.EMPTY)
        .storeCoins(constantGas / 2n)
        .storeMaybeRef(forwardPayload)
        .endCell()

      messages.push({
        to: params.token1UserWalletAddress,
        value: constantGas,
        payload: jettonPayload,
      })
    }
  }

  return messages
}
