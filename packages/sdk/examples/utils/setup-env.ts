import { mnemonicToPrivateKey } from '@ton/crypto'
import { TonClient, WalletContractV5R1 } from '@ton/ton'
import { config } from 'dotenv'

import { createSeedCell } from '../../src'
import { TONCENTER_API_URL } from '../constants'

config({ path: '.env' })

export async function setupTradeAccountEnv() {
  // Check wallet mnemonic
  if (!process.env.WALLET_MNEMONIC) {
    console.error('Please set WALLET_MNEMONIC in your .env file')
    process.exit(1)
  }

  // Check trade account mnemonic
  if (!process.env.TRADE_ACCOUNT_MNEMONIC) {
    console.error('Please set TRADE_ACCOUNT_MNEMONIC in your .env file')
    process.exit(1)
  }

  if (!process.env.TRADE_ACCOUNT_SEED) {
    console.error('Please set TRADE_ACCOUNT_SEED in your .env file')
    process.exit(1)
  }

  // Parse and validate mnemonics
  const walletMnemonic = process.env.WALLET_MNEMONIC.split(' ')
  if (walletMnemonic.length !== 24) {
    console.error('Wallet mnemonic must be 24 words')
    process.exit(1)
  }

  const tradeAccountMnemonic = process.env.TRADE_ACCOUNT_MNEMONIC.split(' ')
  if (tradeAccountMnemonic.length !== 24) {
    console.error('Trade account mnemonic must be 24 words')
    process.exit(1)
  }

  // Generate keypairs from mnemonics
  const walletKeypair = await mnemonicToPrivateKey(walletMnemonic)
  const tradeAccountKeypair = await mnemonicToPrivateKey(tradeAccountMnemonic)

  // Initialize TON client and wallet
  const client = new TonClient({
    endpoint: `${TONCENTER_API_URL}/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  })
  const walletContract = WalletContractV5R1.create({
    workchain: 0,
    publicKey: walletKeypair.publicKey,
    walletId: {
      networkGlobalId: -3,
    },
  })
  const walletContractOpened = await client.open(walletContract)

  const tradingAccountSeed = createSeedCell(Number(process.env.TRADE_ACCOUNT_SEED))

  return {
    walletKeypair,
    client,
    walletContract,
    walletContractOpened,
    tradeAccountKeypair,
    tradingAccountSeed,
  }
}

export async function setupEnv() {
  // Check wallet mnemonic
  if (!process.env.WALLET_MNEMONIC) {
    console.error('Please set WALLET_MNEMONIC in your .env file')
    process.exit(1)
  }

  // Parse and validate mnemonics
  const walletMnemonic = process.env.WALLET_MNEMONIC.split(' ')
  if (walletMnemonic.length !== 24) {
    console.error('Wallet mnemonic must be 24 words')
    process.exit(1)
  }

  // Generate keypairs from mnemonics
  const walletKeypair = await mnemonicToPrivateKey(walletMnemonic)

  // Initialize TON client and wallet
  const client = new TonClient({
    endpoint: `${TONCENTER_API_URL}/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  })
  const walletContract = WalletContractV5R1.create({
    workchain: 0,
    publicKey: walletKeypair.publicKey,
    walletId: {
      networkGlobalId: -3,
    },
  })
  const walletContractOpened = await client.open(walletContract)

  return {
    walletKeypair,
    client,
    walletContract,
    walletContractOpened,
  }
}
