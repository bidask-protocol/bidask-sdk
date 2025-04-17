import { Address, Cell } from '@ton/ton'

/**
 * Parameters for sending a transaction
 */
export type TxParams = {
  /** Destination address */
  to: Address
  /** Amount of TON coins to send (in nanoTON) */
  value: bigint
  /** Cell containing the message payload */
  payload: Cell
}
