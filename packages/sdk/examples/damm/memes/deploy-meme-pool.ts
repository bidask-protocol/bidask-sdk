import { toNano } from '@ton/ton'
import { BigNumber } from 'bignumber.js'
import { createInterface } from 'readline/promises'

import {
  createDeployDammMemeTokenTxParams,
  createDeployDammPoolTxParams,
  createSeedCell,
  MemeJettonWallet,
  MemeVanity,
  PoolFactory,
  TESTNET_MEME_FACTORY_ADDRESS,
  TESTNET_POOL_FACTORY_ADDRESS,
  toBigInt,
  TON_ADDRESS,
} from '../../../src'
import { rateLimiter } from '../../utils/rate-limiter'
import { sendMultipleTransactions } from '../../utils/send-multiple-transactions'
import { setupEnv } from '../../utils/setup-env'

const { client, walletContract, walletContractOpened, walletKeypair } = await setupEnv()

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const seed = Date.now()
const seedCell = createSeedCell(seed)

const poolFactoryContract = new PoolFactory(TESTNET_POOL_FACTORY_ADDRESS)
const poolFactoryContractOpened = client.open(poolFactoryContract)

const poolAddress = await rateLimiter(
  poolFactoryContractOpened.getGetPoolAddress(walletContract.address, seedCell),
)

const jettonMasterContract = MemeVanity.createFromConfig(
  {
    factory: TESTNET_MEME_FACTORY_ADDRESS,
    deployer: walletContract.address,
    seed: seedCell,
  },
  MemeVanity.codeCell,
)

const jettonWalletContract = MemeJettonWallet.createFromConfig(
  {
    ownerAddress: poolAddress,
    jettonMasterAddress: jettonMasterContract.address,
  },
  MemeJettonWallet.codeCell,
)

console.log('Seed: ', seed)
console.log('Pool address: ', poolAddress.toRawString())
console.log('Jetton wallet address: ', jettonWalletContract.address.toRawString())
console.log('Jetton master address: ', jettonMasterContract.address.toRawString())

const memeTokenAmount = toNano(100)
const memeToBuyback = toNano(2)
const initialRawPrice = 3.5356
const memeToSupply = memeTokenAmount - memeToBuyback

const tonToSpend = toBigInt(BigNumber(memeToBuyback).multipliedBy(initialRawPrice).toString())

const txParams = createDeployDammPoolTxParams({
  token0PoolWalletAddress: jettonWalletContract.address,
  token1PoolWalletAddress: TON_ADDRESS,
  tokenXAmount: memeToSupply,
  tokenYAmount: tonToSpend,
  initialRawPrice,
  baseFee: 10n,
  dynamicFeeFactor: 0n,
  timeFilter: 0n,
  timeDecay: 1n,
  seedCell,
  poolDeployerAddress: TESTNET_POOL_FACTORY_ADDRESS,
})

await sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])

await rl.question('⏳ Is the transaction complete? Press Enter to continue: ')
rl.close()

const deployMemeTxParams = createDeployDammMemeTokenTxParams({
  maxSupply: memeTokenAmount,
  memeTokenParams: {
    metadata: {
      name: 'Test Meme',
      decimals: 9,
      symbol: 'TEST',
    },
  },
  memeToSupply,
  initialRawPrice,
  poolAddress,
  seedCell,
  deployerAddress: TESTNET_MEME_FACTORY_ADDRESS,
})

await sendMultipleTransactions(walletContractOpened, walletKeypair, [deployMemeTxParams])
