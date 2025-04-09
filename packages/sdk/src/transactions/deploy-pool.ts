import { Address, beginCell, Cell, toNano } from '@ton/ton'

import { PoolFactory } from '../contracts'
import type { TxParams } from '../types'
import { getBinByPrice, getSqrtPriceX128 } from '../utils'

export const createDeployPoolTxParams = (params: {
  token0PoolWalletAddress: Address
  token1PoolWalletAddress: Address
  bps: bigint
  lpFee: bigint
  initialPrice: number
  seedCell: Cell
}): TxParams => {
  const deployPoolPayload = beginCell()
    .storeUint(PoolFactory.opcodes.DeployPoolMsg, 32)
    .storeUint(0, 64)
    .storeRef(params.seedCell)
    .storeAddress(params.token0PoolWalletAddress)
    .storeAddress(params.token1PoolWalletAddress)
    .storeUint(params.bps, 32)
    .storeUint(params.lpFee, 16)
    .storeUint(getBinByPrice(params.initialPrice, params.bps), 32)
    .storeUint(getSqrtPriceX128(params.initialPrice), 256)
    .endCell()

  const constantGas = toNano('0.06')

  return {
    to: Address.parse('kQCI3Ko1KNLXfgfngK5XjUSBA4FglcLbloHh71ceo8whl2ym'),
    value: constantGas,
    payload: deployPoolPayload,
  }
}
