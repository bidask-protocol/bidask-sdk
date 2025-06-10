import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { JETTON_TRANSFER_GAS } from '../constants'
import { JettonWalletContract } from '../contracts'
import type { TxParams } from '../types'
import { generateRandomQueryId } from '../utils'

/**
 * Creates transaction parameters for transferring a jetton token
 * @param params - Transfer parameters
 * @param params.jettonWalletAddress - Address of the jetton wallet
 * @param params.receiverAddress - Address of the receiver
 * @param params.amount - Amount of jetton to transfer
 * @param params.senderAddress - Address of the sender
 * @param params.forwardAmount - Optional forward amount
 * @param params.forwardPayload - Optional forward payload cell
 * @param params.customPayload - Optional custom payload cell
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 */
export function createTransferJettonTxParams(params: {
  jettonWalletAddress: Address
  receiverAddress: Address
  amount: bigint
  senderAddress: Address
  forwardAmount?: bigint
  forwardPayload?: Cell
  customPayload?: Cell
  queryId?: bigint
}): TxParams {
  const { queryId = generateRandomQueryId(), forwardAmount = 0n } = params

  const jettonTransferBody = beginCell()
    .storeUint(JettonWalletContract.Opcodes.JettonTransfer, 32)
    .storeUint(queryId, 64)
    .storeCoins(params.amount)
    .storeAddress(params.receiverAddress)
    .storeAddress(params.senderAddress)
    .storeMaybeRef(params.customPayload)
    .storeCoins(forwardAmount)
    .storeMaybeRef(params.forwardPayload)
    .endCell()

  return {
    to: params.jettonWalletAddress,
    value: forwardAmount + JETTON_TRANSFER_GAS,
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
  const customPayload = parsingPayload.loadMaybeRef()
  const forwardGas = parsingPayload.loadCoins()
  const forwardPayload = parsingPayload.loadMaybeRef() || undefined
  parsingPayload.endParse()

  return {
    queryId,
    amount,
    receiverAddress,
    senderAddress,
    customPayload,
    forwardGas,
    forwardPayload,
  }
}
