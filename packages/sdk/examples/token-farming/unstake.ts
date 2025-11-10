import { Address } from '@ton/ton'

import { createUnstakeTxParams } from '../../src'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

/**
 * Example for unstaking (claiming rewards) from a farming position.
 *
 * It demonstrates how to:
 *   • Load environment variables and wallet credentials (`setupEnv`).
 *   • Build transaction parameters with `createUnstakeTxParams`.
 *   • Send the transaction using `sendMultipleTransactions`.
 */

const { walletContractOpened, walletKeypair } = await setupEnv()

// Farming position (NFT) address
const farmingPositionAddress = Address.parse(
  'kQBSzUbOkW7fsPwr0PDxrAhq-vUNzz63SVkE2KOAMyi5YuyN',
)

// Build transaction parameters (default forwardAmount = 0.15 TON, queryId = random)
const txParams = createUnstakeTxParams({
  farmingPositionAddress,
  senderAddress: walletContractOpened.address,
})

// Send the transaction
await sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
