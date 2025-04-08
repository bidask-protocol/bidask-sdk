import { Address } from '@ton/ton'

import { ZERO_ADDRESS } from '../constants'

export const isZeroAddress = (address: Address) => {
  return address.equals(ZERO_ADDRESS)
}
