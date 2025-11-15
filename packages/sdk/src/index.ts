/**
 * Bidask SDK
 *
 * ```
 * import { ... } from '@bidask-protocol/sdk'
 * ```
 *
 * @packageDocumentation
 */
import BigNumber from 'bignumber.js'

export * from './contracts'
export * from './types'
export * from './utils'
export {
  BIN_STEP_COEFFICIENT,
  LP_FEE_COEFFICIENT,
  ZERO_ADDRESS,
  TON_ADDRESS,
  POOL_FACTORY_ADDRESS,
  TESTNET_POOL_FACTORY_ADDRESS,
  TESTNET_MEME_FACTORY_ADDRESS,
  TESTNET_MEMEPOOL_FACTORY_ADDRESS,
  TESTNET_BET_EVENTS_MASTER_ADDRESS,
  BET_EVENTS_MASTER_ADDRESS,
  MEME_FACTORY_ADDRESS,
} from './constants'
export * from './transactions'

BigNumber.config({
  POW_PRECISION: 80,
  DECIMAL_PLACES: 80,
  EXPONENTIAL_AT: 1e9,
})
