import { Address, beginCell, Cell, toNano } from '@ton/ton'
import BigNumber from 'bignumber.js'

import { POOL_FACTORY_ADDRESS } from '../constants'
import type { TxParams } from '../types'
import { generateRandomQueryId, toBigInt } from '../utils'

export const createDeployDammPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  tokenXAmount: bigint
  tokenYAmount: bigint
  initialRawPrice: number
  baseFee: bigint
  dynamicFeeFactor: bigint
  timeFilter: bigint
  timeDecay: bigint
  poolStartTimestamp?: number
  poolDeployerAddress?: Address
  queryId?: bigint
  seedCell: Cell
}): TxParams => {
  const {
    queryId = generateRandomQueryId(),
    poolDeployerAddress = POOL_FACTORY_ADDRESS,
    poolStartTimestamp = 0,
  } = params

  if (params.timeFilter < 0n) {
    throw new Error('timeFilter must be >= 0')
  }

  if (params.timeFilter >= params.timeDecay) {
    throw new Error('timeFilter must be < timeDecay')
  }

  let virtualXAmount: bigint
  let virtualYAmount: bigint

  const tokensRelation = Number(params.tokenYAmount) / Number(params.tokenXAmount)

  const relation = tokensRelation / params.initialRawPrice

  if (relation === 1) {
    virtualXAmount = 0n
    virtualYAmount = 0n
  } else if (relation < 1) {
    virtualXAmount = 0n
    virtualYAmount = toBigInt(
      BigNumber(params.tokenXAmount)
        .multipliedBy(params.initialRawPrice)
        .minus(params.tokenYAmount)
        .toString(),
    )
  } else {
    virtualXAmount = toBigInt(
      BigNumber(params.tokenYAmount)
        .dividedBy(params.initialRawPrice)
        .minus(params.tokenXAmount)
        .toString(),
    )
    virtualYAmount = 0n
  }

  const deployDammPoolPayload = beginCell()
    .storeUint(0x0273228f, 32)
    .storeUint(queryId, 64)
    .storeRef(params.seedCell)
    .storeAddress(params.token0PoolWalletAddress)
    .storeAddress(params.token1PoolWalletAddress)
    .storeUint(params.baseFee, 16)
    .storeUint(params.dynamicFeeFactor, 32)
    .storeUint(params.timeFilter, 32)
    .storeUint(params.timeDecay, 32)
    .storeUint(poolStartTimestamp, 64)
    .storeCoins(params.tokenXAmount)
    .storeRef(
      beginCell()
        .storeCoins(params.tokenYAmount)
        .storeCoins(virtualXAmount)
        .storeCoins(virtualYAmount),
    )
    .endCell()

  const constantGas = toNano('0.06')

  return {
    to: poolDeployerAddress,
    value: constantGas,
    payload: deployDammPoolPayload,
  }
}
