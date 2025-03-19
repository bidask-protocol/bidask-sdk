import { BIN_STEP_COEFFICIENT } from '../constants'

export const getBinByPrice = (price: number, bps: bigint) => {
  return Math.floor(Math.log(price) / Math.log(1 + Number(bps) / BIN_STEP_COEFFICIENT))
}

export const getPriceByBin = (bin: number, bps: bigint) => {
  return Math.pow(1 + Number(bps) / BIN_STEP_COEFFICIENT, bin)
}
