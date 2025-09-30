import { fromBigInt, PoolContract, TradeAccount } from '../../src'
import { getJettonInfo } from '../utils/get-jetton-info'
import { getPoolAddress } from '../utils/get-pool-address'
import { getJettonAddressesByPool } from '../utils/get-user-wallet-addressess-by-pool'
import { rateLimiter } from '../utils/rate-limiter'
import { setupTradeAccountEnv } from '../utils/setup-env'

// Get trade account balance for a specific pool
const { client, walletContractOpened, tradingAccountSeed } = await setupTradeAccountEnv()

// Get pool address from env or user input
const poolAddress = await getPoolAddress()

// Get pool contract
const poolContractOpened = client.open(PoolContract.create(poolAddress))

// Get trade account address
const tradeAccountAddress = await rateLimiter(
  poolContractOpened.getTradeAccountAddress({
    userAddress: walletContractOpened.address,
    seedCell: tradingAccountSeed,
  }),
)

// Create trade account instance
const tradeAccount = TradeAccount.createFromAddress(tradeAccountAddress)
const tradeAccountOpened = client.open(tradeAccount)

// Get balances
const { token0Amount, token1Amount } = await rateLimiter(tradeAccountOpened.getDepositBalance())

// Get token info for display
const { jetton0Master, jetton1Master } = await getJettonAddressesByPool(
  client,
  poolAddress,
  walletContractOpened.address,
)

const jetton0Info = await rateLimiter(getJettonInfo(jetton0Master))
const jetton1Info = await rateLimiter(getJettonInfo(jetton1Master))

// Convert to human readable format
const token0Balance = fromBigInt(token0Amount, Number.parseInt(jetton0Info.decimals, 10))
const token1Balance = fromBigInt(token1Amount, Number.parseInt(jetton1Info.decimals, 10))

// Display results
// eslint-disable-next-line no-console
console.log(`\nTrade Account Balance:`)
// eslint-disable-next-line no-console
console.log(`Address: ${tradeAccountAddress.toString()}`)
// eslint-disable-next-line no-console
console.log(`${jetton0Info.symbol}: ${token0Balance}`)
// eslint-disable-next-line no-console
console.log(`${jetton1Info.symbol}: ${token1Balance}`)
