import { KeyPair, sign } from '@ton/crypto'
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from '@ton/ton'

import { VANITY_CODE } from '../constants'
import { RangeStatus, SwapPartialExecutionParams } from '../types'
import { DepositType, LiquidityProvideBins, LiquidityRemoveBins } from '../types/liquidity'
import { generateRandomQueryId } from '../utils'
import { bufferToBigInt } from '../utils/bigint'
import { createLiquidityBurnDict, createLiquidityProvideDict } from '../utils/liquidity/dictionary'

export type TradeAccountConfig = { pool: Address; user: Address; seedCell: Cell }

function tradeAccountConfigToCell(config: TradeAccountConfig): Cell {
  return beginCell()
    .storeAddress(config.pool)
    .storeAddress(config.user)
    .storeRef(config.seedCell)
    .endCell()
}

function createBody(payload: Cell, keypair: KeyPair) {
  const signature = sign(payload.hash(), keypair.secretKey)
  return beginCell()
    .storeSlice(payload.beginParse())
    .storeUint(bufferToBigInt(signature), 512)
    .endCell()
}

export class TradeAccount implements Contract {
  static readonly Opcodes = {
    DepositOnAccount: 0xd8e04bf6,
    Swap: 0xefbbd1b8,
    Withdraw: 0xa3dbaae5,
    LimitOrder: 0x1111684f,
    CancelLimitOrder: 0x30a1507b,
    ProvideLiquidity: 0x70ad4947,
    WithdrawLiquidity: 0x9f7a49dd,
    WithdrawAllLiquidity: 0x6866a085,
    ChangePublicKey: 0xf0cf70b3,
  }

  static createFromAddress(address: Address) {
    return new TradeAccount(address)
  }

  static createFromConfig(config: TradeAccountConfig, workchain = 0) {
    const init = {
      splitDepth: 8,
      code: Cell.fromBoc(Buffer.from(VANITY_CODE, 'hex'))[0],
      data: tradeAccountConfigToCell(config),
    }

    const calculatedAddress = contractAddress(workchain, init)
    const poolPrefix = config.pool.toRawString().slice(0, 4)
    const prefixedAddress = `${poolPrefix}${calculatedAddress.toRawString().slice(4)}`

    return new TradeAccount(Address.parse(prefixedAddress), init)
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
    })
  }

  async sendDeposit(
    provider: ContractProvider,
    via: Sender,
    opts: {
      newCode?: Cell
      amount1: bigint
      amount2: bigint
      queryId?: bigint
    },
    value: bigint = toNano('0.1'),
  ) {
    const { queryId = generateRandomQueryId() } = opts

    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
        .storeUint(queryId, 64)
        .storeMaybeRef(opts.newCode)
        .storeCoins(opts.amount1)
        .storeCoins(opts.amount2)
        .endCell(),
      value,
    })
  }

  /**
   * Send swap
   *
   * @param provider - Contract provider
   * @param keypair - Key pair
   * @param validUntil - Valid until
   * @param seqnoNumber - Number of seqno (0 - 15) (default: 0)
   * @param seqno - Seqno
   * @param poolAddress - Pool address
   * @param seedCell - Seed
   * @param params - Options
   * @param params.receiverAddress - Receiver address
   * @param params.isReceiverAddress - Should be true if trade account is a swap result receiver
   * @param params.amount - TON Amount (default: 0.3 TON)
   * @param params.mode - SendMode
   * @param params.tokenAmount - Token amount to swap
   * @param params.isX - Is swapping token0 for token1
   * @param params.partialExecution - Partial execution (default: true)
   * @param params.slippage - Slippage
   * @param params.exactOut - Exact out (default: 0)
   * @param params.queryId - Query ID (default: random)
   * @param params.rejectPayload - Reject payload (sent only on slippage failure with partial execution disabled)
   * @param params.forwardPayload - Forward payload (sent on successful swap or partial execution)
   */
  async sendExternalSwap(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqnoNumber = 0,
    seqno: number,
    poolAddress: Address,
    seedCell: Cell,
    params: {
      receiverAddress: Address
      isReceiverAddress: boolean
      amount?: bigint
      mode: SendMode
      tokenAmount: bigint
      isX: boolean
      exactOut?: bigint
      queryId?: bigint
      rejectPayload?: Cell
      forwardPayload?: Cell
    } & SwapPartialExecutionParams,
  ) {
    const { exactOut = 0n, amount = toNano('0.3'), queryId = generateRandomQueryId() } = params

    let swapBody = beginCell()
      .storeCoins(amount)
      .storeUint(params.mode, 16)
      .storeCoins(params.tokenAmount)
      .storeBit(params.isX)
      .storeBit(params.allowPartial)

    if (params.allowPartial) {
      swapBody = swapBody.storeUint(params.sqrtX128LastPrice, 256)
    } else {
      swapBody = swapBody.storeCoins(params.minAmountToReceive)
    }

    swapBody = swapBody
      .storeCoins(exactOut)
      .storeMaybeRef(params.rejectPayload)
      .storeMaybeRef(params.forwardPayload)

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.Swap, 32)
      .storeUint(queryId, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqnoNumber, 4)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seedCell)
      .storeRef(swapBody)
      .endCell()

    return provider.external(createBody(msg, keypair))
  }

  /**
   * Withdraw tokens from trading account
   *
   * @param provider - Contract provider
   * @param keypair - Key pair
   * @param validUntil - Valid until
   * @param seqnoNumber - Number of seqno (0 - 15) (default: 0)
   * @param seqno - Seqno
   * @param poolAddress - Pool address
   * @param seedCell - Seed
   * @param params - Options
   * @param params.amount - Amount (default: 0.3 TON)
   * @param params.mode - SendMode (default: CARRY_ALL_REMAINING_BALANCE)
   * @param params.receiverAddress - Receiver address
   * @param params.token0Amount - Token0 amount
   * @param params.token1Amount - Token1 amount
   * @param params.queryId - Query ID (default: random)
   * @param params.forwardPayload - Forward payload (attached to tokens sent to receiver)
   */
  async sendExternalWithdraw(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqnoNumber = 0,
    seqno: number,
    poolAddress: Address,
    seedCell: Cell,
    params: {
      amount?: bigint
      mode: SendMode
      receiverAddress: Address
      token0Amount: bigint
      token1Amount: bigint
      queryId?: bigint
      forwardPayload?: Cell
    },
  ) {
    const { amount = toNano('0.3'), queryId = generateRandomQueryId() } = params

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.Withdraw, 32)
      .storeUint(queryId, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqnoNumber, 4)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seedCell)
      .storeRef(
        beginCell()
          .storeCoins(amount)
          .storeUint(params.mode, 16)
          .storeAddress(params.receiverAddress)
          .storeCoins(params.token0Amount)
          .storeCoins(params.token1Amount)
          .storeMaybeRef(params.forwardPayload)
          .endCell(),
      )
      .endCell()
    await provider.external(createBody(msg, keypair))
  }

  /**
   * Provide liquidity from trading account using external messages
   * Based on createProvideLiquidityTxParams logic with batching support and trading account specific cell structure
   * Automatically fetches initialized ranges from the pool contract
   *
   * @param provider - Contract provider
   * @param keypair - Key pair for signing
   * @param validUntil - Valid until timestamp
   * @param seqnoNumber - Number of seqno (0 - 15) (default: 0)
   * @param seqno - Starting sequence number (will increment for each batch)
   * @param poolAddress - Pool address
   * @param seedCell - Seed cell
   * @param params - Liquidity provision parameters
   * @param params.binsToProvide - Bins with amounts to provide liquidity for
   * @param params.amount - Message amount (gas)
   * @param params.mode - Send mode
   * @param params.queryId - Query ID (default: random)
   * @param params.rejectPayload - Reject payload (sent on refund with deposit from pool)
   * @param params.forwardPayload - Forward payload (sent after mint_notification from multitoken)
   * @returns Promise that resolves when all batches are sent
   */
  async sendExternalProvideLiquidity(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqnoNumber = 0,
    seqno: number,
    poolAddress: Address,
    seedCell: Cell,
    params: {
      binsToProvide: LiquidityProvideBins
      amount: bigint
      mode: SendMode
      rangeStatus: RangeStatus
      queryId?: bigint
      rejectPayload?: Cell
      forwardPayload?: Cell
    },
  ) {
    const { queryId = generateRandomQueryId() } = params

    const { token0Amount, token1Amount } = Object.values(params.binsToProvide).reduce(
      (acc, [x, y]) => ({
        token0Amount: acc.token0Amount + x,
        token1Amount: acc.token1Amount + y,
      }),
      { token0Amount: 0n, token1Amount: 0n },
    )

    const depositType =
      params.rangeStatus === RangeStatus.Initialized ? DepositType.Add : DepositType.Initial

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.ProvideLiquidity, 32)
      .storeUint(queryId, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqnoNumber, 4)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seedCell)
      .storeRef(
        beginCell()
          .storeCoins(params.amount)
          .storeUint(params.mode, 16)
          .storeUint(depositType, 3)
          .storeDict(createLiquidityProvideDict(params.binsToProvide))
          .storeCoins(token0Amount)
          .storeCoins(token1Amount)
          .storeMaybeRef(params.rejectPayload)
          .storeMaybeRef(params.forwardPayload)
          .endCell(),
      )
      .endCell()

    await provider.external(createBody(msg, keypair))
  }

  /**
   * Burn specific liquidity bins from liquidity pool using external messages
   * Based on createBurnTxParams logic with batching support and trading account specific cell structure
   *
   * @param provider - Contract provider
   * @param keypair - Key pair for signing
   * @param validUntil - Valid until timestamp
   * @param seqnoNumber - Number of seqno (0 - 15) (default: 0)
   * @param seqno - Starting sequence number (will increment for each batch)
   * @param poolAddress - Pool address
   * @param seedCell - Seed cell
   * @param params - Liquidity withdrawal parameters
   * @param params.lpMultitokenAddress - LP multitoken contract address
   * @param params.binsToBurn - Bins to burn with LP token amounts
   * @param params.amount - Message amount (gas)
   * @param params.mode - Send mode
   * @param params.queryId - Query ID (default: random)
   * @param params.rejectPayload - Reject payload (sent on burn failure)
   * @param params.forwardPayload - Forward payload (sent on successful burn)
   * @returns Promise that resolves when all batches are sent
   */
  async sendExternalRemoveLiquidity(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqnoNumber = 0,
    seqno: number,
    poolAddress: Address,
    seedCell: Cell,
    params: {
      lpMultitokenAddress: Address
      binsToBurn: LiquidityRemoveBins
      amount: bigint
      mode: SendMode
      queryId?: bigint
      rejectPayload?: Cell
      forwardPayload?: Cell
    },
  ) {
    const { queryId = generateRandomQueryId() } = params

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.WithdrawLiquidity, 32)
      .storeUint(queryId, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqnoNumber, 4)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seedCell)
      .storeRef(
        beginCell()
          .storeCoins(params.amount) // message amount (gas constraints like normal withdraw)
          .storeUint(params.mode, 16) // message mode
          .storeAddress(params.lpMultitokenAddress) // multitoken address
          .storeDict(createLiquidityBurnDict(params.binsToBurn)) // bins array for this batch
          .storeMaybeRef(params.rejectPayload) // reject payload
          .storeMaybeRef(params.forwardPayload) // forward payload
          .endCell(),
      )
      .endCell()

    await provider.external(createBody(msg, keypair))
  }

  /**
   * Withdraw all liquidity from liquidity pool using external message
   * Based on createBurnAllTxParams logic with trading account specific cell structure
   *
   * @param provider - Contract provider
   * @param keypair - Key pair for signing
   * @param validUntil - Valid until timestamp
   * @param seqnoNumber - Number of seqno (0 - 15) (default: 0)
   * @param seqno - Sequence number
   * @param poolAddress - Pool address
   * @param seedCell - Seed cell
   * @param params - Parameters for withdrawing all liquidity
   * @param params.lpMultitokenAddress - LP multitoken contract address
   * @param params.amount - Message amount (gas)
   * @param params.mode - Send mode
   * @param params.queryId - Query ID (default: random)
   * @param params.forwardPayload - Forward payload (sent on successful burn)
   */
  async sendExternalRemoveAllLiquidity(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqnoNumber = 0,
    seqno: number,
    poolAddress: Address,
    seedCell: Cell,
    params: {
      lpMultitokenAddress: Address
      amount: bigint
      mode: SendMode
      queryId?: bigint
      forwardPayload?: Cell
    },
  ) {
    const { queryId = generateRandomQueryId() } = params

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.WithdrawAllLiquidity, 32)
      .storeUint(queryId, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqnoNumber, 4)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seedCell)
      .storeRef(
        beginCell()
          .storeCoins(params.amount) // message amount (gas constraints like normal withdraw)
          .storeUint(params.mode, 16) // message mode
          .storeAddress(params.lpMultitokenAddress) // multitoken address
          .storeMaybeRef(params.forwardPayload) // forward payload
          .endCell(),
      )
      .endCell()

    await provider.external(createBody(msg, keypair))
  }

  async sendExternalSignedMessage(provider: ContractProvider, body: Cell) {
    await provider.external(body)
  }

  /**
   * Change public key of trade account
   *
   * @param provider - Contract provider
   * @param keypair - Key pair
   * @param validUntil - Valid until
   * @param seqnoNumber - Number of seqno (0 - 15) (default: 0)
   * @param seqno - Seqno
   * @param poolAddress - Pool address
   * @param seedCell - Seed
   * @param params - Options
   * @param params.newPublicKey - New public key (32 bytes)
   * @param params.queryId - Query ID (default: random)
   */
  async sendExternalChangePublicKey(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqnoNumber = 0,
    seqno: number,
    poolAddress: Address,
    seedCell: Cell,
    params: {
      newPublicKey: Buffer
      queryId?: bigint
    },
  ) {
    const { queryId = generateRandomQueryId() } = params

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.ChangePublicKey, 32)
      .storeUint(queryId, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqnoNumber, 4)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seedCell)
      .storeRef(beginCell().storeBuffer(params.newPublicKey, 32).endCell())
      .endCell()

    await provider.external(createBody(msg, keypair))
  }

  async getDepositBalance(provider: ContractProvider) {
    const result = await provider.get('get_deposit_balance', [])
    const token0Amount = result.stack.readBigNumber()
    const token1Amount = result.stack.readBigNumber()
    return { token0Amount, token1Amount }
  }

  async getPoolAddress(provider: ContractProvider) {
    const result = await provider.get('get_pool_address', [])
    return result.stack.readAddress()
  }

  async getSeqno(provider: ContractProvider) {
    const result = await provider.get('get_seqno', [])
    return result.stack.readNumber()
  }

  async getSeqnoByNumber(provider: ContractProvider, seqnoNumber: number) {
    const result = await provider.get('get_seqno_by_number', [
      { type: 'int', value: BigInt(seqnoNumber) },
    ])
    return result.stack.readNumber()
  }

  async getSeqnoSlice(provider: ContractProvider): Promise<number[]> {
    const result = await provider.get('get_seqno_slice', [])
    const slice = result.stack.readCell().beginParse()
    const seqnos: number[] = []

    for (let i = 0; i < 16; i++) {
      seqnos.push(slice.loadUint(32))
    }

    return seqnos
  }
}
