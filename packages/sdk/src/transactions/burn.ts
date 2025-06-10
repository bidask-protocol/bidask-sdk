import { Address, beginCell, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { LiquidityRemoveBins } from '../types/liquidity'
import { generateRandomQueryId } from '../utils'
import { createLiquidityBurnDict, divideBurnBinsIntoBatches } from '../utils/liquidity/dictionary'

/**
 * Creates transaction parameters for burning liquidity from a pool
 * @param params - Parameters for the transaction
 * @param params.lpMultitokenAddress - Address of the liquidity pool contract
 * @param params.binsToBurn - Bins to burn
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Array of transaction parameters
 */
export function createBurnTxParams(params: {
  lpMultitokenAddress: Address
  binsToBurn: LiquidityRemoveBins
  queryId?: bigint
}): TxParams[] {
  const { queryId = generateRandomQueryId() } = params

  const batches = divideBurnBinsIntoBatches(params.binsToBurn)

  return batches.map((binsToBurn) => {
    const payload = beginCell()
      .storeUint(LpMultitokenContract.Opcodes.Burn, 32)
      .storeUint(queryId, 64)
      .storeDict(createLiquidityBurnDict(binsToBurn))
      .storeMaybeRef(null)
      .endCell()

    const providingGas = calculateGas(Object.keys(binsToBurn).length)

    return {
      to: params.lpMultitokenAddress,
      value: providingGas,
      payload,
    }
  })
}

const calculateGas = (binsAmount: number): bigint => {
  const nanoTonsPerBin = toNano('0.005')
  const gasForBins = BigInt(binsAmount) * nanoTonsPerBin

  const constantGas = toNano('0.8')

  return constantGas + gasForBins
}
