import { sha256_sync } from '@ton/crypto'
import { Address, beginCell, Cell, Dictionary, toNano } from '@ton/ton'

import { TESTNET_MEME_FACTORY_ADDRESS } from '../constants'
import type { LiquidityProvideBins, TxParams } from '../types'
import { fromBigInt, generateRandomQueryId, getBinByPrice } from '../utils'
import { createLiquidityProvideDict } from '../utils/liquidity/dictionary'

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
export function createDeployMemeTokenTxParams(params: {
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
  binsToProvide: LiquidityProvideBins
  initialRawPrice: number
  bps: bigint
  poolAddress: Address
  seedCell: Cell
  deployerAddress?: Address
  queryId?: bigint
}): TxParams {
  const { deployerAddress = TESTNET_MEME_FACTORY_ADDRESS, queryId = generateRandomQueryId() } =
    params

  const { bidaskExclusive = false } = params.memeTokenParams

  // Calculate total liquidity amounts from bins
  let jettonAmount = 0n
  Object.values(params.binsToProvide).forEach(([x]) => {
    jettonAmount += x
  })

  if (jettonAmount !== params.memeToSupply) {
    throw new Error('Jetton amount does not match memeToSupply')
  }

  const metadata = buildJettonOnchainMetadata({
    name: params.memeTokenParams.metadata.name,
    symbol: params.memeTokenParams.metadata.symbol,
    decimals: params.memeTokenParams.metadata.decimals,
    description: params.memeTokenParams.metadata.description,
    image: params.memeTokenParams.metadata.imageUrl,
  })

  // Use the first bin as the initial bin
  const initialBin = getBinByPrice(params.initialRawPrice, params.bps)

  // Create liquidity dictionary from bins
  const liquidityDict = createLiquidityProvideDict(params.binsToProvide)

  const deployMemePayload = beginCell()
    .storeUint(0x058026ea, 32) // deploy_meme opcode
    .storeUint(queryId, 64)
    .storeCoins(params.maxSupply)
    .storeRef(metadata)
    .storeBit(bidaskExclusive)
    .storeCoins(params.memeToSupply)
    .storeInt(initialBin, 32)
    .storeDict(liquidityDict)
    .storeAddress(params.poolAddress)
    .storeRef(params.seedCell)
    .endCell()

  const buybackAmount = params.maxSupply - params.memeToSupply
  const tonForBuyback =
    Number(fromBigInt(buybackAmount, params.memeTokenParams.metadata.decimals)) *
    params.initialRawPrice

  const constantGas = toNano('5.2')

  return {
    to: deployerAddress,
    value: constantGas + toNano(tonForBuyback),
    payload: deployMemePayload,
  }
}

// function buildJettonOnchainMetadata(content: {
//   name: string
//   symbol: string
//   decimals: number
//   description?: string
//   image?: string
// }): Cell {
//   const metadataDict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())

//   // Helper for Snake-encoded text cells
//   const textCell = (value: string) => beginCell().storeUint(0, 8).storeStringTail(value).endCell()

//   // Add required fields
//   metadataDict.set(sha256_sync('name'), textCell(content.name))
//   metadataDict.set(sha256_sync('symbol'), textCell(content.symbol))
//   metadataDict.set(sha256_sync('decimals'), textCell(content.decimals.toString()))

//   // Add optional fields
//   if (content.description) {
//     metadataDict.set(sha256_sync('description'), textCell(content.description))
//   }
//   if (content.image) {
//     metadataDict.set(sha256_sync('image'), textCell(content.image))
//   }

//   return beginCell()
//     .storeUint(0, 8) // On-chain prefix
//     .storeDictDirect(metadataDict)
//     .endCell()
// }

export function buildJettonOnchainMetadata(internal: {
    name: string
    symbol: string
    decimals: number
    description?: string
    image?: string
  }): Cell {
  const dict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell());
  for (const k in internal) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((internal as any)[k] === undefined) {
          continue;
      }
      const b = beginCell();
      if (k === 'image_data') {
          const chunks = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.Cell());
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const buf = Buffer.from((internal as any)[k], 'base64');
          for (let i = 0; i * 127 < buf.length; i++) {
              chunks.set(
                  i,
                  beginCell()
                      .storeBuffer(buf.subarray(i * 127, (i + 1) * 127))
                      .endCell(),
              );
          }          
          b.storeUint(1, 8).storeDict(chunks).endCell();
      } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          b.storeUint(0, 8).storeStringTail((internal as any)[k].toString());
      }
      dict.set(sha256_sync(k), b.endCell());
  }
  return beginCell().storeUint(0, 8).storeDict(dict).endCell();
}

// const ONCHAIN_CONTENT_PREFIX = 0x00;
// const SNAKE_PREFIX = 0x00;


// export type JettonMetaDataKeys =
//   | "name"
//   | "description"
//   | "image"
//   | "symbol"
//   | "image_data"
//   | "decimals"
//   | "uri";


// const jettonOnChainMetadataSpec: {
//   [key in JettonMetaDataKeys]: "utf8" | "ascii" | undefined;
// } = {
//   name: "utf8",
//   description: "utf8",
//   image: "ascii",
//   decimals: "utf8",
//   symbol: "utf8",
//   image_data: undefined,
//   uri: "ascii",
// };

// export function buildJettonOnchainMetadata(data: { [s: string]: string | undefined }): Cell {
//   const metadataDict = Dictionary.empty(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())

//   const createSnakeCell = (value: string, encoding: "utf8" | "ascii"): Cell => {
//     const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8)
//     let bufferToStore = Buffer.from(value, encoding)
    
//     const rootCell = beginCell().storeUint(SNAKE_PREFIX, 8)
//     let currentCell = rootCell

//     while (bufferToStore.length > 0) {
//       const chunk = bufferToStore.subarray(0, CELL_MAX_SIZE_BYTES)
//       currentCell = currentCell.storeBuffer(chunk)
//       bufferToStore = bufferToStore.subarray(CELL_MAX_SIZE_BYTES)
      
//       if (bufferToStore.length > 0) {
//         const newCell = beginCell()
//         currentCell = currentCell.storeRef(newCell.endCell())
//         currentCell = newCell
//       }
//     }

//     return rootCell.endCell()
//   }

//   Object.entries(data).forEach(([k, v]: [string, string | undefined]) => {
//     const key = k as JettonMetaDataKeys
//     const encoding = jettonOnChainMetadataSpec[key]

//     if (!encoding)
//       throw new Error(`Unsupported onchain key: ${k}`)
    
//     if (v === undefined || v === "") return

//     const keyBuffer = sha256_sync(k)
//     const valueCell = createSnakeCell(v, encoding)
//     metadataDict.set(keyBuffer, valueCell)
//   })

//   return beginCell()
//     .storeUint(ONCHAIN_CONTENT_PREFIX, 8)
//     .storeDictDirect(metadataDict)
//     .endCell()
// }