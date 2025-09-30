import { Address } from '@ton/ton'
import { createInterface } from 'readline/promises'

import { createClaimDammFeesTxParams } from '../../src'
import { getJettonAddressesByDammPool } from '../utils/get-jetton-addressess-by-damm-pool'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

// Interactive fees claiming function using DAMM
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

rl.close()

const txParams = createClaimDammFeesTxParams({
  lpWalletAddress: Address.parse(lpWalletAddressInput),
  senderAddress: walletContractOpened.address,
})

sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
