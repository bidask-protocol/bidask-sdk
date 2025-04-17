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

import { SwapPartialExecutionParams } from '../types'
import { bufferToBigInt } from '../utils/bigint'

export type TradeAccountConfig = { pool: Address; user: Address; publicKey: Buffer; seed: Cell }

function tradeAccountConfigToCell(config: TradeAccountConfig): Cell {
  return beginCell()
    .storeAddress(config.pool)
    .storeAddress(config.user)
    .storeBuffer(config.publicKey, 32)
    .storeRef(beginCell().storeCoins(0).storeCoins(0).storeUint(0, 32))
    .storeRef(config.seed)
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
    DepositOnAccount: 0x52d84692,
    Swap: 0x94eb79d3,
    Withdraw: 0xe5fb23df,
    LimitOrder: 0x1111684f,
    CancelLimitOrder: 0x30a1507b,
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new TradeAccount(address)
  }

  static createFromConfig(config: TradeAccountConfig, code: Cell, workchain = 0) {
    const data = tradeAccountConfigToCell(config)
    const init = { code, data }
    return new TradeAccount(contractAddress(workchain, init), init)
  }

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
    },
    value: bigint = toNano('0.1'),
  ) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(TradeAccount.Opcodes.DepositOnAccount, 32)
        .storeUint(0, 64)
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
   * @param seqno - Seqno
   * @param poolAddress - Pool address
   * @param seed - Seed
   * @param params - Options
   * @param params.receiverAddress - Receiver address
   * @param params.isReceiverAccount - Is receiver account
   * @param params.amount - TON Amount (default: 0.3 TON)
   * @param params.mode - SendMode (default: PAY_GAS_SEPARATELY)
   * @param params.tokenAmount - Token amount to swap
   * @param params.isX - Is swapping token0 for token1
   * @param params.partialExecution - Partial execution (default: true)
   * @param params.slippage - Slippage
   * @param params.exactOut - Exact out (default: 0)
   */
  async sendExternalSwap(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqno: number,
    poolAddress: Address,
    seed: Cell,
    params: {
      receiverAddress: Address
      isReceiverAccount: boolean
      amount?: bigint
      mode?: SendMode
      tokenAmount: bigint
      isX: boolean
      exactOut?: bigint
    } & SwapPartialExecutionParams,
  ) {
    const { exactOut = 0n, amount = toNano('0.3'), mode = SendMode.PAY_GAS_SEPARATELY } = params

    let swapBody = beginCell()
      .storeAddress(params.receiverAddress)
      .storeBit(params.isReceiverAccount)
      .storeCoins(amount)
      .storeUint(mode, 16)
      .storeCoins(params.tokenAmount)
      .storeBit(params.isX)
      .storeBit(params.allowPartial)

    if (params.allowPartial) {
      swapBody = swapBody.storeUint(params.sqrtX128LastPrice, 256)
    } else {
      swapBody = swapBody.storeCoins(params.minAmountToReceive)
    }

    swapBody = swapBody.storeCoins(exactOut)

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.Swap, 32)
      .storeUint(0, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seed)
      .storeRef(swapBody)
      .endCell()

    await provider.external(createBody(msg, keypair))
  }

  /**
   * Withdraw tokens from trading account
   *
   * @param provider - Contract provider
   * @param keypair - Key pair
   * @param validUntil - Valid until
   * @param seqno - Seqno
   * @param poolAddress - Pool address
   * @param seed - Seed
   * @param params - Options
   * @param params.amount - Amount (default: 0.3 TON)
   * @param params.mode - SendMode (default: CARRY_ALL_REMAINING_BALANCE)
   * @param params.receiverAddress - Receiver address
   * @param params.token0Amount - Token0 amount
   * @param params.token1Amount - Token1 amount
   */
  async sendExternalWithdraw(
    provider: ContractProvider,
    keypair: KeyPair,
    validUntil: number,
    seqno: number,
    poolAddress: Address,
    seed: Cell,
    params: {
      amount?: bigint
      mode?: number
      receiverAddress: Address
      token0Amount: bigint
      token1Amount: bigint
    },
  ) {
    const { amount = toNano('0.3'), mode = SendMode.CARRY_ALL_REMAINING_BALANCE } = params

    const msg = beginCell()
      .storeUint(TradeAccount.Opcodes.Withdraw, 32)
      .storeUint(0, 64)
      .storeUint(validUntil, 32)
      .storeUint(seqno, 32)
      .storeAddress(poolAddress)
      .storeRef(seed)
      .storeRef(
        beginCell()
          .storeCoins(amount)
          .storeUint(mode, 16)
          .storeAddress(params.receiverAddress)
          .storeCoins(params.token0Amount)
          .storeCoins(params.token1Amount),
      )
      .endCell()
    await provider.external(createBody(msg, keypair))
  }

  async sendExternalSignedMessage(provider: ContractProvider, body: Cell) {
    await provider.external(body)
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
}
