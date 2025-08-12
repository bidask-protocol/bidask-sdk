import { createInterface } from 'readline/promises'

import {
  createJettonSwapTxParams,
  createJettonSwapV2TxParams,
  getPriceFromSqrtPriceX128,
  getSqrtPriceX128,
  PoolContract,
  RangeContract,
  toBigInt,
} from '../../src'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

// Interactive swap function using TradeAccount
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
  await getJettonAddressesByPool(client, poolAddress, walletContractOpened.address)

// Get token info
const jetton0Info = await getJettonInfo(jetton0Master)
const jetton1Info = await getJettonInfo(jetton1Master)

// Get current price for partial execution parameters
const poolContract = client.open(PoolContract.create(poolAddress))

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

// Get current price for partial execution parameters
const activeRangeAddress = await poolContract.getActiveRange()
const activeRangeContract = client.open(RangeContract.create(activeRangeAddress))
const sqrtPriceX128 = await activeRangeContract.getSqrtPrice()

const slippage = 0.1 // 10% slippage

// Calculate limit price for partial execution
const currentPrice = getPriceFromSqrtPriceX128(sqrtPriceX128)
const lastPrice = isToken0Swap ? currentPrice * (1 - slippage) : currentPrice * (1 + slippage)
const sqrtX128LastPrice = getSqrtPriceX128(lastPrice)

rl.close()

const txParams = createJettonSwapV2TxParams({
  amountIn: tokenAmount,
  senderAddress: walletContractOpened.address,
  jettonWalletAddress: isToken0Swap ? userJetton0WalletAddress : userJetton1WalletAddress,
  poolAddress,
  allowPartial: true,
  sqrtX128LastPrice,
})

sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
