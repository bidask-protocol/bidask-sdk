import { Address } from '@ton/ton'
import { createInterface } from 'readline/promises'

import { createBurnDammTxParams, fromBigInt, JettonWalletContract, toBigInt } from '../../src'
import { getJettonAddressesByDammPool } from '../utils/get-jetton-addressess-by-damm-pool'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

// Interactive liquidity burning function using DAMM
const { client, walletContractOpened, walletKeypair } = await setupEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get pool address
const poolAddress = await getPoolAddress()

// Get jetton master addresses for the pool
const { jetton0Master, jetton1Master } = await getJettonAddressesByDammPool(
  client,
  poolAddress,
  walletContractOpened.address,
)

// Get token info for display purposes
const jetton0Info = await rateLimiter(getJettonInfo(jetton0Master))
const jetton1Info = await rateLimiter(getJettonInfo(jetton1Master))

console.log(`Pool: ${jetton0Info.symbol}/${jetton1Info.symbol}`)

// Get LP wallet address from user
const lpWalletAddressInput = await rl.question('Enter your LP wallet address: ')
const lpWalletAddress = Address.parse(lpWalletAddressInput)

// Get LP wallet balance
const lpWalletContract = client.open(JettonWalletContract.create(lpWalletAddress))
const walletData = await rateLimiter(lpWalletContract.getWalletData())
const currentBalance = walletData.balance

console.log(
  `Current LP balance: ${currentBalance.toString()} (${fromBigInt(currentBalance, 9)} LP tokens)`,
)

// Get amount to burn
const jettonAmountInput = await rl.question('Enter LP jetton amount to burn: ')

rl.close()

// Convert amount (LP tokens typically have 9 decimals)
const jettonAmount = toBigInt(jettonAmountInput)

const txParams = createBurnDammTxParams({
  lpWalletAddress,
  jettonAmount,
  receiverAddress: walletContractOpened.address,
})

sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
