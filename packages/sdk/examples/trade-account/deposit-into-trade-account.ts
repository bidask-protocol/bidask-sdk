import { createInterface } from 'readline/promises'

import { createTradeAccountDepositTxParams, toBigInt } from '../../src'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Example of depositing tokens into a trade account
const { client, walletContractOpened, tradeAccountKeypair, walletKeypair, tradingAccountSeed } =
  await setupTradeAccountEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get pool address
const poolAddress = await getPoolAddress()

// Get user's jetton wallet addresses for the pool
const { userJetton0WalletAddress, userJetton1WalletAddress, jetton0Master, jetton1Master } =
  await getJettonAddressesByPool(client, poolAddress, walletContractOpened.address)

// Get token info
const jetton0Info = await getJettonInfo(jetton0Master)
const jetton1Info = await getJettonInfo(jetton1Master)

// Input token0 amounts
const token0AmountInput = await rl.question(
  `Enter ${jetton0Info.symbol} amount (will use ${jetton0Info.decimals} decimals): `,
)

// Input token1 amounts
const token1AmountInput = await rl.question(
  `Enter ${jetton1Info.symbol} amount (will use ${jetton1Info.decimals} decimals): `,
)

rl.close()

// Parse token amounts
const token0Amount = toBigInt(Number(token0AmountInput), jetton0Info.decimals)
const token1Amount = toBigInt(Number(token1AmountInput), jetton1Info.decimals)

// Create deposit transaction parameters
const txParams = createTradeAccountDepositTxParams({
  poolAddress,
  token0UserWalletAddress: userJetton0WalletAddress,
  token1UserWalletAddress: userJetton1WalletAddress,
  token0Amount,
  token1Amount,
  userAddress: walletContractOpened.address,
  senderAddress: walletContractOpened.address,
  publicKey: tradeAccountKeypair.publicKey,
  seedCell: tradingAccountSeed,
})

// Send the deposit transactions
await sendMultipleTransactions(walletContractOpened, walletKeypair, txParams)
