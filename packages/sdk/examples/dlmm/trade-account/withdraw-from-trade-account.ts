import { SendMode } from '@ton/ton'
import { createInterface } from 'readline/promises'

import { getDeadline, PoolContract, toBigInt, TradeAccount } from '../../src'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Interactive withdraw function using TradeAccount
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

// Get pool contract and trade account address
const poolContractOpened = client.open(PoolContract.create(poolAddress))
const tradeAccountAddress = await poolContractOpened.getTradeAccountAddress({
  userAddress: walletContractOpened.address,
  seedCell: tradingAccountSeed,
})

// Create trade account instance
const tradeAccount = TradeAccount.createFromAddress(tradeAccountAddress)
const tradeAccountOpened = client.open(tradeAccount)

// Get token amounts to withdraw
const token0AmountInput = await rl.question(`Enter ${jetton0Info.symbol} amount to withdraw: `)
const token1AmountInput = await rl.question(`Enter ${jetton1Info.symbol} amount to withdraw: `)

rl.close()

// Convert token amounts
const token0Amount = toBigInt(token0AmountInput, Number.parseInt(jetton0Info.decimals, 10))
const token1Amount = toBigInt(token1AmountInput, Number.parseInt(jetton1Info.decimals, 10))

// Get current seqno
const seqno = await tradeAccountOpened.getSeqno()

// Execute the withdrawal
await tradeAccountOpened.sendExternalWithdraw(
  tradeAccountKeypair,
  getDeadline(),
  0,
  seqno,
  poolAddress,
  tradingAccountSeed,
  {
    mode: SendMode.PAY_GAS_SEPARATELY,
    receiverAddress: walletContractOpened.address,
    token0Amount,
    token1Amount,
  },
)
