import { PoolContract, TradeAccount } from '../../../src'
import { getPoolAddress } from '../../utils/get-pool-address'
import { rateLimiter } from '../../utils/rate-limiter'
import { setupTradeAccountEnv } from '../../utils/setup-env'

// Get trade account balance for a specific pool
const { client, walletContractOpened, tradingAccountSeed } = await setupTradeAccountEnv()

// Get pool address from env or user input
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
const tradeAccount = TradeAccount.createFromConfig({
  pool: poolAddress,
  user: walletContractOpened.address,
  seedCell: tradingAccountSeed,
})

// Display results
// eslint-disable-next-line no-console
console.log(`Onnchain TradeAccount Address: ${tradeAccountAddress.toRawString()}`)
// eslint-disable-next-line no-console
console.log(`Offchain TradeAccount Address: ${tradeAccount.address.toRawString()}`)
