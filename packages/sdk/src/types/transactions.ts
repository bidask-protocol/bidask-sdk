import { Address, Cell } from '@ton/ton'

export type TxParams = {
  to: Address
  value: bigint
  payload: Cell
}
