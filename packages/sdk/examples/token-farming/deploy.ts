import { Address, beginCell, JettonMaster, toNano } from '@ton/ton'

import {
  createDeployFarmingTxParams,
  MemeVanity,
  TESTNET_MEME_FACTORY_ADDRESS,
  toBigInt,
} from '../../src'
import { createSeedCell } from '../../src/utils/seed'
import { rateLimiter } from '../utils/rate-limiter'
import { sendMultipleTransactions } from '../utils/send-multiple-transactions'
import { setupEnv } from '../utils/setup-env'

const { client, walletContractOpened, walletKeypair } = await setupEnv()

// Use wallet address as deployer
const userAddress = walletContractOpened.address

// Generate seed using SDK utility (example seed number)
const seed = createSeedCell(Date.now())

// Example reward token address
const rewardToken = new JettonMaster(
  Address.parse('UQAXFEOoTS9Zrf8fYGvbNjj84IK3_M5gFeA1iBCFgSQnHxHT'),
)
const rewardTokenOpened = client.open(rewardToken)

// Get user reward token wallet address
const userRewardTokenWallet = await rateLimiter(rewardTokenOpened.getWalletAddress(userAddress))

const factoryRewardTokenWallet = await rateLimiter(
  rewardTokenOpened.getWalletAddress(TESTNET_MEME_FACTORY_ADDRESS),
)

const farmingAddress = MemeVanity.createFromConfig(
  {
    factory: TESTNET_MEME_FACTORY_ADDRESS,
    seed,
    deployer: userAddress,
    rest: beginCell().storeAddress(factoryRewardTokenWallet).asSlice(),
  },
  MemeVanity.codeCell,
)

console.warn('Farming address: ', farmingAddress.address)

// Example farming token address
const farmingToken = new JettonMaster(
  Address.parse('UQBtmQ8paru75DLMEu32Fzi5yKYXN0NrjH-wh1O4H0AMAAqX'),
)
const farmingTokenOpened = client.open(farmingToken)

// Get farming token wallet address
const farmingTokenWallet = await rateLimiter(
  farmingTokenOpened.getWalletAddress(farmingAddress.address),
)

// Get reward token wallet address
const rewardTokenWallet = await rateLimiter(
  rewardTokenOpened.getWalletAddress(farmingAddress.address),
)

// Example endOfFarming and refundAddress
const endOfFarming = toBigInt(Date.now() / 1000) + 86400n // one day from now
const refundAddress = userAddress // Example: refund to deployer

// Build transaction parameters
const txParams = createDeployFarmingTxParams({
  factoryAddress: TESTNET_MEME_FACTORY_ADDRESS,
  userAddress,
  jettonWalletAddress: userRewardTokenWallet,
  seed,
  farmingTokenWallet: rewardTokenWallet,
  lpTokenWallet: farmingTokenWallet,
  endOfFarming,
  refundAddress,
  jettonAmount: toNano(10),
})

// Send the deployment transaction
await sendMultipleTransactions(walletContractOpened, walletKeypair, [txParams])
