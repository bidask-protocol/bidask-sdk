import { Address } from '@ton/ton'

/**
 * Information about a pool
 */
export type PoolInfo = {
  /** Address of the token0 wallet */
  token0Wallet: Address
  /** Address of the token1 wallet */
  token1Wallet: Address
  /** Basis points for fee calculation */
  bps: bigint
  /** Fee amount */
  fee: bigint
}
