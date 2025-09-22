import { Address } from '@ton/ton'

import { TONCENTER_API_URL } from '../constants'
import { TON_ADDRESS } from '../../src'

export async function getJettonInfo(jettonMaster: Address): Promise<{
  name: string
  symbol: string
  decimals: string
}> {
  const isTon = TON_ADDRESS.equals(jettonMaster)

  if (isTon) {
    return {
      name: 'TON Coin',
      symbol: 'TON',
      decimals: '9',
    }
  }

  const response = await fetch(`${TONCENTER_API_URL}/getTokenData?address=${jettonMaster}`)
  const data = await response.json()

  return data.result.jetton_content.data
}
