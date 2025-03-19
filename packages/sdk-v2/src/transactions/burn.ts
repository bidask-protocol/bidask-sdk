import { Address, beginCell, Dictionary, toNano } from '@ton/ton'

import { LpMultitokenContract } from '../contracts'
import { TxParams } from '../types'
import { LiquidityRemoveBins } from '../types/liquidity'
import { createPaddedBinDict } from '../utils'

export function createBurnTxParams(params: {
  lpMultitokenAddress: Address
  binsToBurn: LiquidityRemoveBins
}): TxParams {
  const burnDict = createPaddedBinDict({
    bins: params.binsToBurn,
    emptyBin: 0n,
    dict: Dictionary.empty(Dictionary.Keys.Int(32), Dictionary.Values.Buffer(122)),
    iterator: (bins, dict, binDictIndex) => {
      let liquidityCell = beginCell()

      for (const [, burnAmount] of bins) {
        liquidityCell = liquidityCell.storeUint(burnAmount, 244)
      }

      dict.set(binDictIndex, liquidityCell.asSlice().loadBuffer(122))

      return dict
    },
  })

  const payload = beginCell()
    .storeUint(LpMultitokenContract.Opcodes.Burn, 32)
    .storeUint(0, 64)
    .storeDict(burnDict)
    .storeMaybeRef(null)
    .endCell()

  const constantGas = toNano('1')

  return {
    to: params.lpMultitokenAddress,
    value: constantGas,
    payload,
  }
}
