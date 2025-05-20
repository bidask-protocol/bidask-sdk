import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JettonWalletContract } from '../contracts'
import type { TxParams } from '../types'

/**
 * Creates transaction parameters for transferring a jetton token
 * @param params - Transfer parameters
 * @param params.jettonWalletAddress - Address of the jetton wallet
 * @param params.receiverAddress - Address of the receiver
 * @param params.amount - Amount of jetton to transfer
 * @param params.senderAddress - Address of the sender
 * @param params.forwardGas - Optional forward gas amount
 * @param params.forwardPayload - Optional forward payload cell
 * @param params.queryId - Query ID (default: 0n)
 */
export function createTransferJettonTxParams(params: {
  jettonWalletAddress: Address
  receiverAddress: Address
  amount: bigint
  senderAddress: Address
  forwardGas?: bigint
  forwardPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = 0n, forwardGas = 0n } = params

  const constantGas = toNano('0.2')

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.amount)
    .storeAddress(params.receiverAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(Cell.EMPTY)
    .storeCoins(forwardGas)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return {
    to: params.jettonWalletAddress,
    value: forwardGas + constantGas,
    payload: jettonTransferBody,
  }
}

/**
 * Parses the payload of a transfer jetton transaction
 * @param payload - The payload cell to parse
 * @returns The parsed payload
 */
export function parseTransferJettonPayload(payload: Cell) {
  const parsingPayload = payload.beginParse()

  parsingPayload.loadUintBig(32) // skip opcode
  const queryId = parsingPayload.loadUintBig(64)
  const amount = parsingPayload.loadCoins()
  const receiverAddress = parsingPayload.loadAddress()
  const senderAddress = parsingPayload.loadAddress()
  parsingPayload.loadMaybeRef() // skip forward payload
  const forwardGas = parsingPayload.loadCoins()
  const forwardPayload = parsingPayload.loadMaybeRef() || undefined
  parsingPayload.endParse()

  return {
    queryId,
    amount,
    receiverAddress,
    senderAddress,
    forwardGas,
    forwardPayload,
  }
}
