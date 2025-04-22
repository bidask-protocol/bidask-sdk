import { Address } from '@ton/ton'

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

/** Pool factory address */
export const POOL_FACTORY_ADDRESS = Address.parse(
  'EQCXeklSavPod6x7zUWLSTzSjYGX7W8Ted4BaMA2OlY3ziNP',
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
