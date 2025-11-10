import { Address, JettonMaster, toNano } from '@ton/ton'

import { createStakeTxParams } from '../../src'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

/**
 * Example for staking LP jettons into a farming contract.
 *
 * It demonstrates how to:
 *   • Load environment variables and wallet credentials (`setupEnv`).
 *   • Get the user's LP jetton wallet address.
 *   • Build transaction parameters with `createStakeTxParams`.
 *   • Send the transaction using `sendMultipleTransactions`.
 */

const { client, walletContractOpened, walletKeypair } = await setupEnv()

// Use wallet address as deployer
const userAddress = walletContractOpened.address

// Farming contract address
const farmingContractAddress = Address.parse(
  'kQASsDnH1w7Lf8542K9450tiwa8RAUt1CAvwUENYQeRt8JTp',
)

// Example farming token (LP token) address
const farmingToken = new JettonMaster(
  Address.parse('UQBtmQ8paru75DLMEu32Fzi5yKYXN0NrjH-wh1O4H0AMAAqX'),
)
const farmingTokenOpened = client.open(farmingToken)

// Get user's LP jetton wallet address
const userLpJettonWalletAddress = await rateLimiter(
  farmingTokenOpened.getWalletAddress(userAddress),
)

console.warn('User LP jetton wallet:', userLpJettonWalletAddress)

// Stake parameters
const amount = toNano(1) // Amount of LP jettons to stake
const itemIndex = 0n // 0 for new NFT position, otherwise existing index
const farmingRecipient = userAddress // Rewards receiver

// Build transaction parameters
const txParams = createStakeTxParams({
  farmingContractAddress,
  lpJettonWalletAddress: userLpJettonWalletAddress,
  amount,
  senderAddress: userAddress,
  itemIndex,
  farmingRecipient,
})

// Send the transaction
await sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
