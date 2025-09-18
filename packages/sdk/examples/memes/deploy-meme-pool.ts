import { Cell, toNano } from '@ton/ton'
import { createInterface } from 'readline/promises'

import {
  createDeployDlmmPoolTxParams,
  createDeployMemeTokenTxParams,
  createSeedCell,
  getBinByPrice,
  LiquidityProvideBins,
  MemeJettonWallet,
  MemeVanity,
  PoolFactory,
  TESTNET_MEMEPOOL_FACTORY_ADDRESS,
  TESTNET_MEME_FACTORY_ADDRESS,
  TON_ADDRESS,
} from '../../src'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

const { client, walletKeypair, walletContract, walletContractOpened } = await setupEnv()

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const poolFactoryContract = new PoolFactory(TESTNET_MEMEPOOL_FACTORY_ADDRESS)
const poolFactoryContractOpened = await client.open(poolFactoryContract)

const seedCell = createSeedCell(Number(new Date().getTime()))

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

const initialRawPrice = 0.01
const bps = 300n

const createMemeTonPoolTxParams = createDeployDlmmPoolTxParams({
  token0PoolWalletAddress: jettonWalletContract.address,
  token1PoolWalletAddress: TON_ADDRESS,
  bps,
  baseFee: 10n,
  dynamicFeeFactor: 16n,
  timeFilter: 99n,
  timeDecay: 100n,
  initialRawPrice,
  seedCell,
  poolDeployerAddress: TESTNET_MEMEPOOL_FACTORY_ADDRESS,
})

await sendMultipleTransactions(walletContractOpened, walletKeypair, [createMemeTonPoolTxParams])

console.log('Pool address: ', poolAddress)
await rl.question('⏳ Waiting for pool deployment to complete... Press Enter to continue: ')
rl.close()

const binsToProvide = {} as unknown as LiquidityProvideBins

const initialBin = getBinByPrice(initialRawPrice, bps)

const binsCount = 296

for (let i = initialBin; i < initialBin + binsCount; i++) {
  binsToProvide[i + 1] = [toNano(1), 0n]
}

const createMemeTxParams = createDeployMemeTokenTxParams({
  maxSupply: toNano(400),
  memeTokenParams: {
    metadata: {
      name: 'Meme Token',
      symbol: 'MTKN',
      decimals: 9,
    },
  },
  memeToSupply: toNano(binsCount),
  binsToProvide,
  initialRawPrice,
  bps,
  poolAddress,
  seedCell,
  deployerAddress: TESTNET_MEME_FACTORY_ADDRESS,
})

await sendMultipleTransactions(walletContractOpened, walletKeypair, [createMemeTxParams])
console.log('Meme Jetton Master address: ', jettonMasterContract.address.toString())
