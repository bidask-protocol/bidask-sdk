import { sha256_sync } from '@ton/crypto'
import { Address, beginCell, Cell, Dictionary, toNano } from '@ton/ton'
import BigNumber from 'bignumber.js'

import { TESTNET_MEME_FACTORY_ADDRESS } from '../constants'
import type { TxParams } from '../types'
import { fromBigInt, generateRandomQueryId, toBigInt } from '../utils'

const twoPow128 = BigNumber('340282366920938463463374607431768211456') // 2^128

/**
 * @ignore
 *
 * Creates transaction parameters for deploying a meme token with liquidity pool
 * @param params - Parameters for the transaction
 * @param params.maxSupply - Maximum supply of the meme token
 * @param params.metadata - Metadata cell for the token
 * @param params.bidaskExclusive - Whether the pool is BidAsk exclusive
 * @param params.binsToProvide - Bins with amounts to provide liquidity for
 * @param params.initializedRanges - Array of range numbers that are already initialized
 * @param params.poolAddress - Address where the pool will be deployed
 * @param params.seedCell - Seed cell for deterministic deployment
 * @param params.deployerAddress - Optional deployer address (defaults to factory)
 * @param params.queryId - Optional query ID for the transaction (defaults to random)
 * @returns Transaction parameters
 */
export function createDeployDammMemeTokenTxParams(params: {
  maxSupply: bigint
  memeTokenParams: {
    metadata: {
      name: string
      decimals: number
      symbol: string
      description?: string
      imageUrl?: string
    }
    bidaskExclusive?: boolean
  }
  memeToSupply: bigint
  initialRawPrice: number
  poolAddress: Address
  seedCell: Cell
  deployerAddress?: Address
  queryId?: bigint
}): TxParams {
  const { deployerAddress = TESTNET_MEME_FACTORY_ADDRESS, queryId = generateRandomQueryId() } =
    params

  const { bidaskExclusive = false } = params.memeTokenParams

  const metadata = buildJettonOnchainMetadata({
    name: params.memeTokenParams.metadata.name,
    symbol: params.memeTokenParams.metadata.symbol,
    decimals: params.memeTokenParams.metadata.decimals,
    description: params.memeTokenParams.metadata.description,
    image: params.memeTokenParams.metadata.imageUrl,
  })

  const funnyPrice = toBigInt(
    BigNumber(params.initialRawPrice).multipliedBy(twoPow128).toFixed(0, BigNumber.ROUND_UP),
  )

  const deployMemePayload = beginCell()
    .storeUint(0xaa41517c, 32) // deploy_meme opcode
    .storeUint(queryId, 64)
    .storeCoins(params.maxSupply)
    .storeMaybeRef(metadata)
    .storeBit(bidaskExclusive)
    .storeCoins(params.memeToSupply)
    .storeAddress(params.poolAddress)
    .storeUint(funnyPrice, 256)
    .storeRef(params.seedCell)
    .endCell()

  const buybackAmount = params.maxSupply - params.memeToSupply
  const tonForBuyback =
    Number(fromBigInt(buybackAmount, params.memeTokenParams.metadata.decimals)) *
    params.initialRawPrice

  const constantGas = toNano('2.2')

  return {
    to: deployerAddress,
    value: constantGas + toNano(tonForBuyback),
    payload: deployMemePayload,
  }
}

export function buildJettonOnchainMetadata(internal: {
  name: string
  symbol: string
  decimals: number
  description?: string
  image?: string
}): Cell {
  const dict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())
  for (const k in internal) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((internal as any)[k] === undefined) {
      continue
    }
    const b = beginCell()
    if (k === 'image_data') {
      const chunks = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.Cell())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buf = Buffer.from((internal as any)[k], 'base64')
      for (let i = 0; i * 127 < buf.length; i++) {
        chunks.set(
          i,
          beginCell()
            .storeBuffer(buf.subarray(i * 127, (i + 1) * 127))
            .endCell(),
        )
      }
      b.storeUint(1, 8).storeDict(chunks).endCell()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      b.storeUint(0, 8).storeStringTail((internal as any)[k].toString())
    }
    dict.set(sha256_sync(k), b.endCell())
  }
  return beginCell().storeUint(0, 8).storeDict(dict).endCell()
}
