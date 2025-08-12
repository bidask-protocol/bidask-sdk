import { Address } from '@ton/ton'

import { TONCENTER_API_URL } from '../constants'

export async function getJettonInfo(jettonMaster: Address): Promise<{
  name: string
  symbol: string
  decimals: string
}> {
  const response = await fetch(`${TONCENTER_API_URL}/getTokenData?address=${jettonMaster}`)
  const data = await response.json()

  return data.result.jetton_content.data
}
