import { SendMode } from '@ton/ton'
import { createInterface } from 'readline/promises'

import {
  getDeadline,
  getPriceFromSqrtPriceX128,
  getSqrtPriceX128,
  PoolContract,
  RangeContract,
  toBigInt,
  TradeAccount,
} from '../../src'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { rateLimiter } from '../utils/rate-limiter'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Interactive swap function using TradeAccount
const { client, walletContractOpened, tradeAccountKeypair, tradingAccountSeed } =
  await setupTradeAccountEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get pool address
const poolAddress = await rateLimiter(getPoolAddress())

// Get jetton master addresses for the pool
const { jetton0Master, jetton1Master } = await getJettonAddressesByPool(
  client,
  poolAddress,
  walletContractOpened.address,
)

// Get token info
const jetton0Info = await rateLimiter(getJettonInfo(jetton0Master))
const jetton1Info = await rateLimiter(getJettonInfo(jetton1Master))

// Get current price for partial execution parameters
const poolContract = client.open(PoolContract.create(poolAddress))

// Get trade account address from pool contract
const tradeAccountAddress = await rateLimiter(
  poolContract.getTradeAccountAddress({
    userAddress: walletContractOpened.address,
    seedCell: tradingAccountSeed,
  }),
)

// Create trade account instance from address
const tradeAccount = TradeAccount.createFromAddress(tradeAccountAddress)
const tradeAccountOpened = client.open(tradeAccount)

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
const activeRangeAddress = await rateLimiter(poolContract.getActiveRange())
const activeRangeContract = client.open(RangeContract.create(activeRangeAddress))
const sqrtPriceX128 = await rateLimiter(activeRangeContract.getSqrtPrice())

const slippage = 0.1 // 10% slippage

// Calculate limit price for partial execution
const currentPrice = getPriceFromSqrtPriceX128(sqrtPriceX128)
const lastPrice = isToken0Swap ? currentPrice * (1 - slippage) : currentPrice * (1 + slippage)
const sqrtX128LastPrice = getSqrtPriceX128(lastPrice)

rl.close()

for (let i = 0; i < 1; i++) {
  // Get current seqno
  const seqno = await rateLimiter(tradeAccountOpened.getSeqnoByNumber(i))

  // Execute the swap
  await tradeAccountOpened.sendExternalSwap(
    tradeAccountKeypair,
    getDeadline(),
    i,
    seqno,
    poolAddress,
    tradingAccountSeed,
    {
      receiverAddress: tradeAccountOpened.address,
      isReceiverAddress: true,
      mode: SendMode.PAY_GAS_SEPARATELY,
      tokenAmount,
      isX: isToken0Swap,
      exactOut: 0n,
      allowPartial: true,
      sqrtX128LastPrice,
    },
  )
}
