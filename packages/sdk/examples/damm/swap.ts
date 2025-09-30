import { createInterface } from 'readline/promises'

import {
  createJettonDammSwapTxParams,
  createTonDammSwapTxParams,
  toBigInt,
  TxParams,
} from '../../src'
import { getJettonAddressesByDammPool } from '../utils/get-jetton-addressess-by-damm-pool'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

// Interactive swap function using DAMM
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

// Get swap direction
const swapDirection = await rl.question(
  `Swap direction? (0 for ${jetton0Info.symbol} → ${jetton1Info.symbol}, 1 for ${jetton1Info.symbol} → ${jetton0Info.symbol}): `,
)
const isToken0Swap = swapDirection === '0'

// Get token amount to swap
const tokenToSwap = isToken0Swap ? jetton0Info.symbol : jetton1Info.symbol
const decimals = isToken0Swap ? jetton0Info.decimals : jetton1Info.decimals
const tokenAmountInput = await rl.question(`Enter ${tokenToSwap} amount to swap: `)
const tokenAmount = toBigInt(tokenAmountInput, decimals)

rl.close()

let txParams: TxParams
if (tokenToSwap === 'TON') {
  txParams = createTonDammSwapTxParams({
    nativeAmount: tokenAmount,
    receiverAddress: walletContractOpened.address,
    slippage: 0n,
    senderAddress: walletContractOpened.address,
    poolAddress,
  })
} else {
  txParams = createJettonDammSwapTxParams({
    amountIn: tokenAmount,
    receiverAddress: walletContractOpened.address,
    slippage: 0n,
    senderAddress: walletContractOpened.address,
    jettonWalletAddress: isToken0Swap ? userJetton0WalletAddress : userJetton1WalletAddress,
    poolAddress,
  })
}

sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
