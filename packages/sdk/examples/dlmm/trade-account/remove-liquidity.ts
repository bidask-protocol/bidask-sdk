import { Address, SendMode } from '@ton/ton'
import { createInterface } from 'readline/promises'

import {
  getBinByPrice,
  getDeadline,
  getPriceFromSqrtPriceX128,
  LpMultitokenContract,
  PoolContract,
  RangeContract,
  toBigInt,
  TradeAccount,
} from '../../src'
import { LiquidityRemoveBins } from '../../src/types/liquidity'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Interactive liquidity removal function using TradeAccount
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
const jetton0Info = await getJettonInfo(jetton0Master)
const jetton1Info = await getJettonInfo(jetton1Master)

// Get pool contract and current price
const poolContractOpened = client.open(PoolContract.create(poolAddress))
const { bps } = await poolContractOpened.getPoolInfo()
const activeRangeAddress = await poolContractOpened.getActiveRange()
const activeRangeContract = client.open(RangeContract.create(activeRangeAddress))
const sqrtPriceX128 = await activeRangeContract.getSqrtPrice()
const currentPrice = getPriceFromSqrtPriceX128(sqrtPriceX128)
const currentBin = getBinByPrice(currentPrice, bps)

// Get trade account address
const tradeAccountAddress = await poolContractOpened.getTradeAccountAddress({
  userAddress: walletContractOpened.address,
  seedCell: tradingAccountSeed,
})

// Create trade account instance
const tradeAccount = TradeAccount.createFromAddress(tradeAccountAddress)
const tradeAccountOpened = client.open(tradeAccount)

// Get LP multitoken address - need to get this from user for now
// In a real implementation, you'd query the user's LP positions
const lpMultitokenAddressInput = await rl.question('Enter LP multitoken contract address: ')
const lpMultitokenAddress = Address.parse(lpMultitokenAddressInput)

// Get LP token positions
const lpMultitokenContractOpened = client.open(LpMultitokenContract.create(lpMultitokenAddress))
const lpTokens = await lpMultitokenContractOpened.getTokens()

// Filter out bins with zero LP tokens
const nonZeroBins = Object.entries(lpTokens)
  .filter(([, amount]) => amount > 0n)
  .map(([bin, amount]) => ({ bin: Number(bin), amount }))

if (nonZeroBins.length === 0) {
  // eslint-disable-next-line no-console
  console.log('No LP tokens found in this multitoken contract')
  rl.close()
  process.exit(1)
}

// Show user's LP positions
// eslint-disable-next-line no-console
console.log(`\nPool: ${jetton0Info.symbol}/${jetton1Info.symbol}`)
// eslint-disable-next-line no-console
console.log(`Current bin: ${currentBin}`)
// eslint-disable-next-line no-console
console.log(`\nYour LP positions:`)
nonZeroBins.forEach(({ bin, amount }) => {
  // eslint-disable-next-line no-console
  console.log(`Bin ${bin}: ${amount.toString()} LP tokens`)
})

// Get removal parameters
const fromBinInput = await rl.question('\nEnter from bin to remove: ')
const toBinInput = await rl.question('Enter to bin to remove: ')
const percentageInput = await rl.question('Enter percentage to remove (1-100): ')

// Get gas amount (optional)
const gasAmountInput = await rl.question('Enter gas amount in TON (or press enter for 1.0): ')
const gasAmount = gasAmountInput ? toBigInt(Number(gasAmountInput), 9) : toBigInt(1.0, 9)

rl.close()

// Parse inputs
const fromBin = Number(fromBinInput)
const toBin = Number(toBinInput)
const percentage = Number(percentageInput)

if (percentage < 1 || percentage > 100) {
  // eslint-disable-next-line no-console
  console.log('Invalid percentage. Must be between 1 and 100.')
  process.exit(1)
}

// Filter bins in the specified range
const binsInRange = nonZeroBins.filter(({ bin }) => bin >= fromBin && bin <= toBin)

if (binsInRange.length === 0) {
  // eslint-disable-next-line no-console
  console.log('No LP tokens found in the specified bin range')
  process.exit(1)
}

// Calculate bins to burn
const binsToBurn: LiquidityRemoveBins = {}
binsInRange.forEach(({ bin, amount }) => {
  binsToBurn[bin] = (amount * BigInt(percentage)) / 100n
})

// Check if we're removing all LP tokens (100% of all user's bins)
const isRemovingAllBins = binsInRange.length === nonZeroBins.length && percentage === 100

// Get current seqno
const seqno = await tradeAccountOpened.getSeqno()

if (isRemovingAllBins) {
  // Use sendExternalRemoveAllLiquidity for complete removal
  await tradeAccountOpened.sendExternalRemoveAllLiquidity(
    tradeAccountKeypair,
    getDeadline(),
    0,
    seqno,
    poolAddress,
    tradingAccountSeed,
    {
      lpMultitokenAddress,
      amount: gasAmount,
      mode: SendMode.PAY_GAS_SEPARATELY,
    },
  )
} else {
  // Use sendExternalRemoveLiquidity for partial removal
  await tradeAccountOpened.sendExternalRemoveLiquidity(
    tradeAccountKeypair,
    getDeadline(),
    0,
    seqno,
    poolAddress,
    tradingAccountSeed,
    {
      lpMultitokenAddress,
      binsToBurn,
      amount: gasAmount,
      mode: SendMode.PAY_GAS_SEPARATELY,
    },
  )
}
