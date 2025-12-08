import { Address } from '@ton/ton'
import { createInterface } from 'readline/promises'

import { createClaimMemePoolOwnerFeesTxParams } from '../../../src'
import { sendMultipleTransactions } from '../../utils/send-multiple-transactions'
import { setupTradeAccountEnv } from '../../utils/setup-env'

// Interactive liquidity removal function using TradeAccount
const { walletContractOpened, walletKeypair } = await setupTradeAccountEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get LP multitoken address - need to get this from user for now
// In a real implementation, you'd query the user's LP positions
const lpMultitokenAddressInput = await rl.question('Enter LP multitoken contract address: ')
const lpMultitokenAddress = Address.parse(lpMultitokenAddressInput)

const jettonMasterAddressInput = await rl.question('Enter jetton master contract address: ')
const jettonMasterAddress = Address.parse(jettonMasterAddressInput)

rl.close()

const txParams = createClaimMemePoolOwnerFeesTxParams({
  lpMultitokenAddress,
  memeAddress: jettonMasterAddress,
  firstBinGroup: Math.floor(-298 / 4),
  lastBinGroup: Math.floor(-298 / 4),
})

await sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
