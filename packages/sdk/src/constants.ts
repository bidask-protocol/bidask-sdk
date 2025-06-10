import { Address, toNano } from '@ton/ton'

/**
 * Zero address
 *
 * Used for native TON coin
 */
export const ZERO_ADDRESS = Address.parse(
  '0:0000000000000000000000000000000000000000000000000000000000000000',
)

/**
 * TON address (alias for `ZERO_ADDRESS`)
 *
 * Used for native TON coin
 */
export const TON_ADDRESS = ZERO_ADDRESS

/** Testnet pool factory address */
export const TESTNET_POOL_FACTORY_ADDRESS = Address.parse(
  'EQCXeklSavPod6x7zUWLSTzSjYGX7W8Ted4BaMA2OlY3ziNP',
)

/** Mainnet pool factory address */
export const POOL_FACTORY_ADDRESS = Address.parse(
  'EQAuBZGak9BdkxuCC9gWUsY4Em3jog94BI4eRzX-3_Bidask',
)

/**
 * Bin step coefficient
 *
 * Used to convert bps into human-readable values
 *
 * @example
 * 1 = 0.01%
 * 100 = 1%
 * 10000 = 100%
 */
export const BIN_STEP_COEFFICIENT = 10000

/**
 * Liquidity provider fee coefficient
 *
 * Used to convert fees basic points into human-readable values
 *
 * @example
 * 1 = 0.01%
 * 100 = 1%
 * 10000 = 100%
 */
export const LP_FEE_COEFFICIENT = 10000

export const BINS_PER_RANGE = 2048
export const RANGE_OFFEST = 1024
export const MAX_PROVIDED_BINS_IN_MESSAGE = 260
export const MAX_BURNED_BINS_IN_MESSAGE = 300

export const JETTON_TRANSFER_GAS = toNano('0.06')
