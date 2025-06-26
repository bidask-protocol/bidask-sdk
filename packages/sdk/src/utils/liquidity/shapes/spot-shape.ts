import BigNumber from 'bignumber.js'

import { BIN_STEP_COEFFICIENT } from '../../../constants'
import { CreateShapeParams, ShapeCreatorResult } from '../../../types/liquidity'
import { getBinByPrice } from '../../bins'
import { shapeCreator } from './shape-creator'

/**
 * Creates bin dictionary for spot shape
 *
 * @returns The spot shape
 */
export const createSpotShape = (params: CreateShapeParams): ShapeCreatorResult => {
  const activeBin = getBinByPrice(params.currentPrice, params.bps)

  const token0Amount = params.token0Amount ? BigNumber(params.token0Amount) : BigNumber(1)
  const token1Amount = params.token1Amount ? BigNumber(params.token1Amount) : BigNumber(1)

  const autocomplete = params.autocomplete ?? null

  const sqrtPrice = BigNumber(params.currentPrice).sqrt()

  const binStep = Number(params.bps) / BIN_STEP_COEFFICIENT

  const { baseRatio = 1, fallbackRatio = 0.8 } = params

  return shapeCreator(
    token0Amount,
    token1Amount,
    autocomplete,
    'spot',
    params.fromBin,
    params.toBin,
    baseRatio,
    fallbackRatio,
    activeBin,
    sqrtPrice,
    binStep,
  )
}
