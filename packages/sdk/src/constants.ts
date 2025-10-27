import { Address, Cell, toNano } from '@ton/ton'

/**
 * Zero address
 *
 * Used for native TON coin
 */
export const ZERO_ADDRESS = Address.parse(
  '0:0000000000000000000000000000000000000000000000000000000000000000',
)

/**
 * TON address (alias for `ZERO_ADDRESS`)
 *
 * Used for native TON coin
 */
export const TON_ADDRESS = ZERO_ADDRESS

/** Testnet pool factory address */
export const TESTNET_POOL_FACTORY_ADDRESS = Address.parse(
  'EQCXeklSavPod6x7zUWLSTzSjYGX7W8Ted4BaMA2OlY3ziNP',
)

/** Mainnet pool factory address */
export const POOL_FACTORY_ADDRESS = Address.parse(
  'EQAuBZGak9BdkxuCC9gWUsY4Em3jog94BI4eRzX-3_Bidask',
)

/**
 * @ignore
 *
 * Testnet memepool factory address
 *
 * */
export const TESTNET_MEMEPOOL_FACTORY_ADDRESS = Address.parse(
  '0QCP-pjWgVb6clw0tlMouAOR4yHI6uJp9w0h-TgjcQbk3TeZ',
)

/**
 * Testnet meme factory address
 * */
export const TESTNET_MEME_FACTORY_ADDRESS = Address.parse(
  'kQBtsL6K6ambRRCmdUXSpmeT5ZWxjfTNUASpjluzAt7rIkDV',
)

/**
 * Mainnet meme factory address
 * */
export const MEME_FACTORY_ADDRESS = Address.parse(
  'EQCWvQxsTVJMW3iUaWID64HYC8NeId-uWSkQ_EWHt7U-11FU',
)

/**
 * Bin step coefficient
 *
 * Used to convert bps into human-readable values
 *
 * @example
 * 1 = 0.01%
 * 100 = 1%
 * 10000 = 100%
 */
export const BIN_STEP_COEFFICIENT = 10000

/**
 * Liquidity provider fee coefficient
 *
 * Used to convert fees basic points into human-readable values
 *
 * @example
 * 1 = 0.01%
 * 100 = 1%
 * 10000 = 100%
 */
export const LP_FEE_COEFFICIENT = 10000

export const BINS_PER_RANGE = 2048
export const RANGE_OFFEST = 1024
export const MAX_PROVIDED_BINS_IN_MESSAGE = 260
export const MAX_BURNED_BINS_IN_MESSAGE = 300

export const JETTON_TRANSFER_GAS = toNano('0.06')

export const VANITY_CODE =
  'b5ee9c72410104010094000114ff00f4a413f4bcf2c80b010202c6020300f1d8418e0124be09c1da89a1f48007a1a60663f481f48063f40062e3ae43f40063f40060a4278e0be51005a63fa67fe809e80844dd1c566ab66a6a09081f6391963e27967e039e2cb19e2d92e3003191960aa0079e2ce1f4042596d59993060df601c06e43f60840dd226125daa9c441a1da3ddaa6aa45e2266f0009b0cdd7c220602eaf95'

export const VANITY_CODE_CELL = Cell.fromBoc(Buffer.from(VANITY_CODE, 'hex'))[0]

export const MEME_VANITY_CODE =
  'b5ee9c72410104010042000114ff00f4a413f4bcf2c80b010202c80203004fd5f123e48041da8841a1f48061f1258e0be5c0c803a9ae99daa841f609a1da3ddaa7f12e03e20a730008a9395f0366cd04dd'

export const MEME_VANITY_CODE_CELL = Cell.fromBoc(Buffer.from(MEME_VANITY_CODE, 'hex'))[0]
