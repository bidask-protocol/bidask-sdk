import { Address, Cell } from '@ton/ton'

export type TxParams = {
  to: Address
  value: bigint
  payload: Cell
}

export type SwapPartialParams =
  | {
      allowPartial: true
      sqrtX128LastPrice: bigint
    }
  | {
      allowPartial: false
      minAmountToReceive: bigint
    }
