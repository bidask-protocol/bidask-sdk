import { Address } from '@ton/ton'

export type PoolInfo = {
  token0Wallet: Address
  token1Wallet: Address
  bps: bigint
  fee: bigint
}
