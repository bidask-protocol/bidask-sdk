import { Address } from '@ton/ton'

import { ZERO_ADDRESS } from '../constants'

/**
 * Checks if an address is the zero address
 * @param address - The address to check
 * @returns `true` if the address is the zero address, `false` otherwise
 */
export const isZeroAddress = (address: Address) => {
  return address.equals(ZERO_ADDRESS)
}

/**
 * Checks if an address is the TON address (alias for `isZeroAddress`)
 * @param address - The address to check
 * @returns `true` if the address is the TON address, `false` otherwise
 */
export const isTonAddress = isZeroAddress