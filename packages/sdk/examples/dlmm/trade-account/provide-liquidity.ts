import { SendMode } from '@ton/ton'
import { createInterface } from 'readline/promises'

import {
  createCurveShape,
  getBinByPrice,
  getDeadline,
  getPriceFromSqrtPriceX128,
  PoolContract,
  RangeContract,
  RangeStatus,
  toBigInt,
  TradeAccount,
} from '../../src'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { rateLimiter } from '../utils/rate-limiter'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Interactive liquidity providing function using TradeAccount
const { client, walletContractOpened, tradeAccountKeypair, tradingAccountSeed } =
  await setupTradeAccountEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get pool address
const poolAddress = await getPoolAddress()

// Get jetton master addresses for the pool
const { jetton0Master, jetton1Master } = await getJettonAddressesByPool(
  client,
  poolAddress,
  walletContractOpened.address,
)

// Get token info
const jetton0Info = await rateLimiter(getJettonInfo(jetton0Master))
const jetton1Info = await rateLimiter(getJettonInfo(jetton1Master))

// Get pool contract and current price
const poolContractOpened = client.open(PoolContract.create(poolAddress))
const { bps } = await rateLimiter(poolContractOpened.getPoolInfo())

const activeRangeAddress = await rateLimiter(poolContractOpened.getActiveRange())
const activeRangeContractOpened = client.open(RangeContract.create(activeRangeAddress))
const sqrtPriceX128 = await rateLimiter(activeRangeContractOpened.getSqrtPrice())
const currentPrice = getPriceFromSqrtPriceX128(sqrtPriceX128)
const currentBin = getBinByPrice(currentPrice, bps)

// Get trade account address
const tradeAccountAddress = await rateLimiter(
  poolContractOpened.getTradeAccountAddress({
    userAddress: walletContractOpened.address,
    seedCell: tradingAccountSeed,
  }),
)

// Create trade account instance
const tradeAccount = TradeAccount.createFromAddress(tradeAccountAddress)
const tradeAccountOpened = client.open(tradeAccount)

// Get token amounts to provide
const token0AmountInput = await rl.question(`Enter ${jetton0Info.symbol} amount to provide: `)
const token1AmountInput = await rl.question(`Enter ${jetton1Info.symbol} amount to provide: `)

// Show current bin and get range from user
// eslint-disable-next-line no-console
console.log(`Current bin: ${currentBin}`)

const fromBinInput = await rl.question('Enter from bin: ')
const toBinInput = await rl.question('Enter to bin: ')

const gasAmountInput = await rl.question('Enter gas amount in TON (or press enter for 0.8): ')
const gasAmount = gasAmountInput ? toBigInt(Number(gasAmountInput), 9) : toBigInt(0.8, 9)

rl.close()

// Convert token amounts and parse bins
const token0Amount = toBigInt(token0AmountInput, Number.parseInt(jetton0Info.decimals, 10))
const token1Amount = toBigInt(token1AmountInput, Number.parseInt(jetton1Info.decimals, 10))
const fromBin = Number(fromBinInput)
const toBin = Number(toBinInput)

// Create curve shape liquidity distribution
const binsToProvide = createCurveShape({
  token0Amount,
  token1Amount,
  currentPrice,
  fromBin,
  toBin,
  bps,
})

// Get range statuses to determine if ranges are initialized
const rangesStatuses = await rateLimiter(
  poolContractOpened.getRangesStatusesByLiquidityBins(binsToProvide.bins),
)
const hasInitializedRange = Object.values(rangesStatuses).includes(RangeStatus.Initialized)
const rangeStatus = hasInitializedRange ? RangeStatus.Initialized : RangeStatus.Uninitialized

// Get current seqno
const seqno = await rateLimiter(tradeAccountOpened.getSeqno())

// Execute the liquidity provision
await tradeAccountOpened.sendExternalProvideLiquidity(
  tradeAccountKeypair,
  getDeadline(),
  0,
  seqno,
  poolAddress,
  tradingAccountSeed,
  {
    binsToProvide: binsToProvide.bins,
    amount: gasAmount,
    mode: SendMode.PAY_GAS_SEPARATELY,
    rangeStatus,
  },
)
