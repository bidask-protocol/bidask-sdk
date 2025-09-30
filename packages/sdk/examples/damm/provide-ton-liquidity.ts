import { createInterface } from 'readline/promises'

import { createProvideTonLiquidityDammTxParams, toBigInt } from '../../src'
import { getJettonAddressesByDammPool } from '../utils/get-jetton-addressess-by-damm-pool'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

// Interactive liquidity providing function using DAMM
const { client, walletContractOpened, walletKeypair } = await setupEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get pool address
const poolAddress = await getPoolAddress()

// Get jetton master addresses for the pool
const { jetton0Master, userJetton0WalletAddress, jetton1Master, userJetton1WalletAddress } =
  await getJettonAddressesByDammPool(client, poolAddress, walletContractOpened.address)

// Get token info
const jetton0Info = await rateLimiter(getJettonInfo(jetton0Master))
const jetton1Info = await rateLimiter(getJettonInfo(jetton1Master))

// Determine which token is TON and which is jetton
const isTonFirst = jetton0Info.symbol === 'TON'
const tonInfo = isTonFirst ? jetton0Info : jetton1Info
const jettonInfo = isTonFirst ? jetton1Info : jetton0Info
const jettonWalletAddress = isTonFirst ? userJetton1WalletAddress : userJetton0WalletAddress

// Get amounts to provide
const tonAmountInput = await rl.question(`Enter ${tonInfo.symbol} amount to provide: `)
const jettonAmountInput = await rl.question(`Enter ${jettonInfo.symbol} amount to provide: `)

// Get liquidity lock preference
const lockLiquidityInput = await rl.question('Lock liquidity? (y/n): ')
const lockLiquidity = lockLiquidityInput.toLowerCase() === 'y'

rl.close()

// Convert amounts
const tonAmount = toBigInt(tonAmountInput, Number.parseInt(tonInfo.decimals, 10))
const jettonAmount = toBigInt(jettonAmountInput, Number.parseInt(jettonInfo.decimals, 10))

const txParams = createProvideTonLiquidityDammTxParams({
  jettonWalletAddress,
  jettonAmount,
  tonAmount,
  senderAddress: walletContractOpened.address,
  poolAddress,
  lockLiquidity,
})

sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
