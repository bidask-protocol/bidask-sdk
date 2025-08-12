import { Address, JettonMaster, TonClient } from '@ton/ton'

import { JettonWalletContract, PoolContract } from '../../src'
import { rateLimiter } from './rate-limiter'

export async function getJettonAddressesByPool(
  client: TonClient,
  poolAddress: Address,
  userWallet: Address,
) {
  const poolContract = PoolContract.create(poolAddress)
  const poolContractOpened = client.open(poolContract)

  const { token0Wallet: poolJetton0WalletAddress, token1Wallet: poolJetton1WalletAddress } =
    await rateLimiter(poolContractOpened.getPoolInfo())

  const jetton0WalletOpened = client.open(JettonWalletContract.create(poolJetton0WalletAddress))
  const jetton1WalletOpened = client.open(JettonWalletContract.create(poolJetton1WalletAddress))

  const { jettonMaster: jetton0Master } = await rateLimiter(jetton0WalletOpened.getWalletData())
  const { jettonMaster: jetton1Master } = await rateLimiter(jetton1WalletOpened.getWalletData())

  const jetton0MasterOpened = client.open(JettonMaster.create(jetton0Master))
  const jetton1MasterOpened = client.open(JettonMaster.create(jetton1Master))

  const userJetton0WalletAddress = await rateLimiter(
    jetton0MasterOpened.getWalletAddress(userWallet),
  )
  const userJetton1WalletAddress = await rateLimiter(
    jetton1MasterOpened.getWalletAddress(userWallet),
  )

  return {
    userJetton0WalletAddress,
    userJetton1WalletAddress,
    jetton0Master,
    jetton1Master,
    poolJetton0WalletAddress,
    poolJetton1WalletAddress,
  }
}
