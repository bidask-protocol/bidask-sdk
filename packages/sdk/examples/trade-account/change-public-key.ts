import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto'
import { createInterface } from 'readline/promises'

import { getDeadline, PoolContract, TradeAccount } from '../../src'
import { getPoolAddress } from '../utils/get-pool-address'
import { rateLimiter } from '../utils/rate-limiter'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Example of changing public key for a trade account
const { client, walletContractOpened, tradeAccountKeypair, tradingAccountSeed } =
  await setupTradeAccountEnv()

// Setup readline interface for user prompts
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Get pool address
const poolAddress = await getPoolAddress()

// Get pool contract and trade account address
const poolContract = client.open(PoolContract.create(poolAddress))

const tradeAccountAddress = await rateLimiter(
  poolContract.getTradeAccountAddress({
    userAddress: walletContractOpened.address,
    seedCell: tradingAccountSeed,
  }),
)

// Create trade account instance
const tradeAccount = TradeAccount.createFromAddress(tradeAccountAddress)
const tradeAccountOpened = client.open(tradeAccount)

// Get current seqno
const currentSeqno = await rateLimiter(tradeAccountOpened.getSeqno())

// Prompt for new mnemonic (optional)
const newMnemonicInput = await rl.question(
  'Enter new 24-word mnemonic for trade account (press Enter to generate new one): ',
)

let newMnemonic: string[]
if (newMnemonicInput.trim() === '') {
  // Generate new mnemonic if none provided
  newMnemonic = await mnemonicNew()
  // eslint-disable-next-line no-console
  console.log(`\n📝 Generated mnemonic (save this securely): ${newMnemonic.join(' ')}`)
} else {
  // Use provided mnemonic
  newMnemonic = newMnemonicInput.trim().split(' ')
  if (newMnemonic.length !== 24) {
    throw new Error('New mnemonic must be 24 words')
  }
}

// Confirm the change
const confirmInput = await rl.question(
  '\n⚠️  Are you sure you want to change the public key? (yes/no): ',
)

if (confirmInput.toLowerCase() !== 'yes' && confirmInput.toLowerCase() !== 'y') {
  process.exit(0)
}

rl.close()

// Generate new keypair from mnemonic
const newKeypair = await mnemonicToPrivateKey(newMnemonic)

// Send change public key transaction
await tradeAccountOpened.sendExternalChangePublicKey(
  tradeAccountKeypair, // Current keypair for signing
  getDeadline(),
  0, // seqnoNumber (0-15)
  currentSeqno,
  poolAddress,
  tradingAccountSeed,
  {
    newPublicKey: newKeypair.publicKey,
  },
)
