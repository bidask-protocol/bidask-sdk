import { Address } from '@ton/ton'
import { createInterface } from 'readline/promises'

import { createClaimDammMemePoolOwnerFeesTxParams } from '../../../src'
import { sendMultipleTransactions } from '../../utils/send-multiple-transactions'
import { setupEnv } from '../../utils/setup-env'

// Interactive DAMM meme pool owner fees claiming function
const { walletContractOpened, walletKeypair } = await setupEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get jetton master address
const jettonMasterAddressInput = await rl.question('Enter jetton master contract address: ')
const jettonMasterAddress = Address.parse(jettonMasterAddressInput)

// Get LP wallet address
const lpWalletAddressInput = await rl.question('Enter LP wallet address: ')
const lpWalletAddress = Address.parse(lpWalletAddressInput)

rl.close()

const txParams = createClaimDammMemePoolOwnerFeesTxParams({
  memeAddress: jettonMasterAddress,
  lpWalletAddress,
  receiverAddress: walletContractOpened.address,
})

await sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
