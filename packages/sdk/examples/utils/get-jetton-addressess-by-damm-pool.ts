import { Address, JettonMaster, TonClient } from '@ton/ton'

import { JettonWalletContract, PoolDammContract, TON_ADDRESS } from '../../src'
import { rateLimiter } from './rate-limiter'

export async function getJettonAddressesByDammPool(
  client: TonClient,
  poolAddress: Address,
  userWallet: Address,
) {
  const poolContract = PoolDammContract.create(poolAddress)
  const poolContractOpened = client.open(poolContract)

  const { token0Wallet: poolJetton0WalletAddress, token1Wallet: poolJetton1WalletAddress } =
    await rateLimiter(poolContractOpened.getPoolInfo())

  const isTonPool = TON_ADDRESS.equals(poolJetton1WalletAddress)

  const jetton0WalletOpened = client.open(JettonWalletContract.create(poolJetton0WalletAddress))
  const { jettonMaster: jetton0Master } = await rateLimiter(jetton0WalletOpened.getWalletData())
  const jetton0MasterOpened = client.open(JettonMaster.create(jetton0Master))

  const userJetton0WalletAddress = await rateLimiter(
    jetton0MasterOpened.getWalletAddress(userWallet),
  )

  if (isTonPool) {
    return {
      userJetton0WalletAddress,
      jetton0Master,
      poolJetton0WalletAddress,

      userJetton1WalletAddress: TON_ADDRESS,
      jetton1Master: TON_ADDRESS,
      poolJetton1WalletAddress: TON_ADDRESS,
    }
  }

  const jetton1WalletOpened = client.open(JettonWalletContract.create(poolJetton1WalletAddress))
  const { jettonMaster: jetton1Master } = await rateLimiter(jetton1WalletOpened.getWalletData())
  const jetton1MasterOpened = client.open(JettonMaster.create(jetton1Master))

  const userJetton1WalletAddress = await rateLimiter(
    jetton1MasterOpened.getWalletAddress(userWallet),
  )

  return {
    userJetton0WalletAddress,
    jetton0Master,
    poolJetton0WalletAddress,

    userJetton1WalletAddress,
    jetton1Master,
    poolJetton1WalletAddress,
  }
}
