import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { fromBigInt, generateRandomQueryId } from '../utils'

/**
 * Creates a transaction parameters for burning all liquidity from a pool
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the liquidity pool contract
 * @param params.amountOfBins - Amount of bins to burn
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createBurnAllTxParams(params: {
  queryId?: bigint
  amountOfBins: number
  lpMultitokenAddress: Address
}): TxParams {
  const { queryId = generateRandomQueryId() } = params

  const payload = beginCell()
    .storeUint(LpMultitokenContract.Opcodes.BurnAll, 32)
    .storeUint(queryId, 64)
    .storeMaybeRef(null)
    .endCell()

  return {
    to: params.lpMultitokenAddress,
    value: calculateGas(params.amountOfBins),
    payload,
  }
}

const calculateGas = (binsAmount: number): bigint => {
  const nanoTonsPerBin = toNano('0.006')
  const gasForBins = BigInt(binsAmount) * nanoTonsPerBin

  const constantGas = toNano('0.8')

  return constantGas + gasForBins
}
