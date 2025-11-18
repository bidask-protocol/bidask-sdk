# Bidask SDK

> **Warning**: This library is in beta. It may contain bugs and is subject to breaking changes in future updates

## Code examples

You can always find code examples in the [examples](https://github.com/bidask-protocol/bidask-sdk/tree/main/packages/sdk/examples) directory.

## Providing Liquidity

### Usage Example

```typescript
import { Address } from "@ton/ton";
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  PoolContract,
  RangeContract,
  JettonMaster,
  createProvideNativeLiquidityTxParams,
  createProvideLiquidityTxParams,
  getBinByPrice,
  getPriceFromSqrtPriceX128,
  toBigInt,
  isZeroAddress,
  getDeadline,
  createCurveShape,
  TxParams,
} from "@bidask-protocol/sdk";

// The pool you want to provide liquidity to
const selectedPool = {
  poolAddress: "0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d",
  bps: 60n,
  token0: {
    address: "0:fa0b96ec813ecc248d6505570d99311c6936a565507196bc759014e24aaaca84";
    decimals: "9";
  },
  token1: {
    address: "0:0000000000000000000000000000000000000000000000000000000000000000";
    decimals: "9";
  };

// The amount of tokens you want to provide liquidity
const token0Amount = "100"; // human readable format
const token1Amount = "230"; // human readable format

// Create pool contract instance
const pool = PoolContract.create(Address.parse(selectedPool.poolAddress));
const poolContract = tonapiClientAdapter.open(pool);

// Get the active range to determine current price
const activeRangeAddress = await poolContract.getActiveRange();
const activeRangeContract = tonapiClientAdapter.open(
  RangeContract.create(activeRangeAddress)
);

// Get current price information
const currentSqrtPrice = await activeRangeContract.getSqrtPrice();
const currentPrice = getPriceFromSqrtPriceX128(currentSqrtPrice);
const currentBinIndex = getBinByPrice(currentPrice, selectedPool.bps);

// Providing liquidity to 10 bins on each side of the current price
const firstBinIndex = currentBinIndex - 10;
const lastBinIndex = currentBinIndex + 10;

const token0AmountBN = toBigInt(token0Amount, selectedPool.token0.decimals);
const token1AmountBN = toBigInt(token1Amount, selectedPool.token1.decimals);

// Create the shape of the bins to provide
// Available options are: createCurveShape, createSpotShape, createBidaskShape
const binsToProvide = createCurveShape({
  token0Amount: token0AmountBN,
  token1Amount: token1AmountBN,
  currentPrice: currentPrice,
  fromBin: firstBinIndex,
  toBin: lastBinIndex,
  bps: binStep,
})

// Get token wallet addresses
const jetton0 = await JettonMaster.create(
  Address.parse(selectedPool.token0.address)
);
const jetton0Contract = tonapiClientAdapter.open(jetton0);
const jetton0Wallet = await jetton0Contract.getWalletAddress(
  Address.parse(userAddress)
);

// Get initialized ranges
const rangesStatuses = await poolContract.getRangesStatusesByLiquidityBins(binsToProvide);

const initializedRanges = Object.entries(rangesStatuses)
  .filter(([, status]) => status === RangeStatus.Initialized)
  .map(([range]) => Number(range));

let txParams
// Handle TON + Jetton case
if (isZeroAddress(selectedPool.token1.address)) {
  // Create transaction parameters for providing TON + Jetton
  txParams = createProvideNativeLiquidityTxParams({
    poolAddress: pool.address,
    senderAddress: Address.parse(userAddress),
    binsToProvide: binsToProvide,
    jettonWalletAddress: jetton0Wallet,
    initializedRanges: initializedRanges,
  });
} else {
  // Handle Jetton + Jetton case
  const jetton1 = await JettonMaster.create(
    Address.parse(selectedPool.token1.address)
  );
  const jetton1Contract = tonapiClientAdapter.open(jetton1);
  const jetton1Wallet = await jetton1Contract.getWalletAddress(
    Address.parse(userAddress)
  );

  // Create transaction parameters for providing two jettons
  txParams = createProvideLiquidityTxParams({
    poolAddress: pool.address,
    jettonWalletAddress0: jetton0Wallet,
    jettonWalletAddress1: jetton1Wallet,
    senderAddress: Address.parse(userAddress),
    binsToProvide: binsToProvide,
    initializedRanges: initializedRanges,
  });
}

// Send transactions
tonConnectUI.sendTransaction({
  validUntil: getDeadline(),
  messages: txParams.map((tx) => ({
    address: tx.to.toString(),
    amount: tx.value.toString(),
    payload: tx.payload.toBoc().toString("base64"),
  })),
});
```

## Burning Liquidity

### Usage Example

```typescript
import { Address } from "@ton/ton";
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  PoolContract,
  RangeContract,
  LpMultitokenContract,
  createBurnAllTxParams,
  createBurnTxParams,
  getDeadline,
  TxParams,
} from "@bidask/sdk";

// The pool you want to burn liquidity from
const selectedPool = {
  poolAddress:
    "0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d",
  bps: 60n,
  token0: {
    address: "0:fa0b96ec813ecc248d6505570d99311c6936a565507196bc759014e24aaaca84";
    decimals: "9";
  },
  token1: {
    address: "0:0000000000000000000000000000000000000000000000000000000000000000";
    decimals: "9";
  };

// The percentage of liquidity to burn
const burnPercentage = 50;

// Create pool contract instance
const pool = PoolContract.create(Address.parse(selectedPool.poolAddress));
const poolContract = tonapiClientAdapter.open(pool);

// Get the active range
const activeRangeAddress = await poolContract.getActiveRange();
const activeRangeContract = tonapiClientAdapter.open(
  RangeContract.create(activeRangeAddress)
);

// Get LP multitoken wallet address
const lpMultitokenAddress = await activeRangeContract.getLpMultitokenWallet(
  Address.parse(tonConnectUI.account!.address)
);

let txParams: TxParams;
// Burn all liquidity
if (burnPercentage === 100) {
  txParams = createBurnAllTxParams({ lpMultitokenAddress });
} else {
  // Burn partial liquidity
  const lpMultitokenContract = tonapiClientAdapter.open(
    LpMultitokenContract.create(lpMultitokenAddress)
  );

  const lpTokenBins = await lpMultitokenContract.getTokens();

  txParams = createBurnTxParams({
    lpMultitokenAddress,
    binsToBurn: Object.fromEntries(
      Object.entries(lpTokenBins).map(([bin, amount]) => {
        return [Number(bin), (amount * BigInt(burnPercentage)) / 100n];
      })
    ),
  });
}

tonConnectUI.sendTransaction({
  validUntil: getDeadline(),
  messages: [
    {
      address: burnTxParams.to.toRawString(),
      amount: burnTxParams.value.toString(),
      payload: burnTxParams.payload.toBoc().toString("base64"),
    },
  ],
});
```

## Swapping Tokens

### Usage Example

```typescript
import {
  createJettonSwapTxParams,
  createTonSwapTxParams,
  getDeadline,
  getPriceFromSqrtPriceX128,
  getSqrtPriceX128,
  isZeroAddress,
  JettonMaster,
  JettonWalletContract,
  PoolContract,
  RangeContract,
  SwapPartialExecutionParams,
  toBigInt,
  TxParams,
} from '@bidask/sdk'
import { Address } from '@ton/ton'
import { TonConnectUI } from '@tonconnect/ui-react'

// The pool you want to swap in
const poolData = {
  poolAddress: '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d',
  bps: 60n,
  token0: {
    address: '0:fa0b96ec813ecc248d6505570d99311c6936a565507196bc759014e24aaaca84',
    decimals: '9',
  },
  token1: {
    address: '0:0000000000000000000000000000000000000000000000000000000000000000',
    decimals: '9',
  },
}

// Token you're swapping from
const tokenFrom = poolData.token0

// Token you're swapping to
const tokenTo = poolData.token1

// Amount to swap
const amountFromRaw = '100' // human readable format
const slippage = 0.01 // 1% slippage

// Create pool contract instance
const pool = PoolContract.create(Address.parse(poolData.poolAddress))
const poolContract = tonapiClientAdapter.open(pool)

// Get current price
const activeRangeAddress = await poolContract.getActiveRange()
const activeRange = RangeContract.create(activeRangeAddress)
const activeRangeContract = tonapiClientAdapter.open(activeRange)
const sqrtPriceX128 = await activeRangeContract.getSqrtPrice()
const currentPrice = getPriceFromSqrtPriceX128(sqrtPriceX128)

// Partial execution parameters
let partialExecutionParams: SwapPartialExecutionParams
if (partialExecution) {
  const isToken0Swap = Address.parse(tokenFrom.address).equals(jettonMaster)

  // MINIMUM/MAXIMUM price you're willing to swap at in case of partial execution
  const lastPrice = isToken0Swap ? currentPrice * (1 - slippage) : currentPrice * (1 + slippage)

  partialExecutionParams = {
    allowPartial: true,
    sqrtX128LastPrice: getSqrtPriceX128(lastPrice),
  }
} else {
  // MINIMUM amount out you expect to receive
  const minimumExpectedAmountOut = toBigInt('232', tokenTo.decimals)

  partialExecutionParams = {
    allowPartial: false,
    minAmountToReceive: minimumExpectedAmountOut,
  }
}

let txParams: TxParams
if (isZeroAddress(Address.parse(tokenFrom.address))) {
  // Handle TON swap -> Jetton case
  const lastPrice = currentPrice * (1 + slippage)

  txParams = createTonSwapTxParams({
    poolAddress: pool.address,
    amountIn: toBigInt(amountFromRaw, 9),
    senderAddress: Address.parse(userAddress),
    receiverAddress: Address.parse(userAddress),
    ...partialExecutionParams,
  })
} else {
  // Handle Jetton swap -> Jetton/TON case
  const tokenFromJettonContract = tonapiClientAdapter.open(
    JettonMaster.create(Address.parse(tokenFrom.address)),
  )

  const tokenFromUserWallet = await tokenFromJettonContract.getWalletAddress(
    Address.parse(walletAddress),
  )

  txParams = createJettonSwapTxParams({
    poolAddress: pool.address,
    amountIn: toBigInt(amountFromRaw, tokenFrom.decimals),
    tokenIn: tokenFromJettonContract.address,
    senderAddress: Address.parse(userAddress),
    receiverAddress: Address.parse(userAddress),
    senderAddress: Address.parse(userAddress),
    jettonWalletAddress: tokenFromUserWallet,
    ...partialExecutionParams,
  })
}

tonConnectUI.sendTransaction({
  validUntil: getDeadline(),
  messages: [
    {
      address: txParams.to.toRawString(),
      amount: swapParams.value.toString(),
      payload: txParams.payload.toBoc().toString('base64'),
    },
  ],
})
```

## Trading Account

### Deposit into trading account

```typescript
import { createTradeAccountDepositTxParams } from '@bidask/sdk'
import { Address } from '@ton/ton'
import { TonConnectUI } from '@tonconnect/ui-react'

const poolAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'
const userToken0WalletAddress = '0:fa0b96ec813ecc248d6505570d99311c6936a565507196bc759014e24aaaca84'
const userToken1WalletAddress = '0:0000000000000000000000000000000000000000000000000000000000000000' // Zero address for TON
const token0Amount = '100' // human readable format
const token0Decimals = 9
const token1Amount = '230' // human readable format
const token1Decimals = 9
const userAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'

const tradeAccountPublicKey = 'public_key'
const tradeAccountSeed = 0

const transactions = createTradeAccountDepositTxParams({
  poolAddress: Address.parse(poolAddress),
  token0UserWalletAddress: Address.parse(userToken0WalletAddress),
  token1UserWalletAddress: Address.parse(userToken1WalletAddress),
  token0Amount: toBigInt(token0Amount, token0Decimals),
  token1Amount: toBigInt(token1Amount, token1Decimals),
  userAddress: Address.parse(userAddress),
  senderAddress: Address.parse(userAddress),
  publicKey: tradeAccountPublicKey,
  seed: tradeAccountSeed,
})

const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 60,
  messages: transactions.map((tx) => ({
    address: tx.to.toRawString(),
    amount: String(tx.value),
    payload: tx.payload.toBoc().toString('base64'),
  })),
}

tonConnectUI.sendTransaction(transaction)
```

### Swap tokens using trading account

```typescript
import { getDeadline, TradeAccount } from '@bidask/sdk'
import { KeyPair } from '@ton/crypto'
import { Address } from '@ton/ton'
import { TonConnectUI } from '@tonconnect/ui-react'

const tradingAccountAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'
const tradingAccount = TradeAccount.createFromAddress(Address.parse(tradingAccountAddress))
const tradingAccountContract = tonapiClientAdapter.open(tradingAccount)

const poolAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'
const isX = true // if swapping token0(X) to token1(Y)
const tokenFromAmount = '100' // human readable format
const tokenFromDecimals = 9
const userAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'

const tradeAccountKeypair: KeyPair = {}
const tradeAccountSeed = 0

const seedCell = beginCell().storeUint(tradeAccountSeed, 64).endCell()

const tradeAccountSeqno = await tradingAccountContract.getSeqno()

// check `Swapping tokens` block for partial execution params logic
let partialExecutionParams: SwapPartialExecutionParams
// {...}

tradingAccountContract.sendExternalSwap(
  tradeAccountKeypair,
  getDeadline(),
  tradeAccountSeqno,
  Address.parse(poolAddress),
  seedCell,
  {
    receiverAddress: Address.parse(tradingAccountAddress),
    isReceiverAccount: true,
    tokenAmount: toBigInt(tokenFromAmount, tokenFromDecimals),
    isX: isX,
    ...partialExecutionParams,
  },
)
```

### Withdraw tokens from trading account

```typescript
import { getDeadline, TradeAccount } from '@bidask/sdk'
import { KeyPair } from '@ton/crypto'
import { Address } from '@ton/ton'
import { TonConnectUI } from '@tonconnect/ui-react'

const tradingAccountAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'
const tradingAccount = TradeAccount.createFromAddress(Address.parse(tradingAccountAddress))
const tradingAccountContract = tonapiClientAdapter.open(tradingAccount)

const poolAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'
const token0Amount = '100' // human readable format
const token0Decimals = 9
const token1Amount = '230' // human readable format
const token1Decimals = 9
const userAddress = '0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d'

const tradeAccountKeypair: KeyPair = {}
const tradeAccountSeed = 0

const seedCell = beginCell().storeUint(tradeAccountSeed, 64).endCell()

const tradeAccountSeqno = await tradingAccountContract.getSeqno()

tradingAccountContract.sendExternalWithdraw(
  tradeAccountKeypair,
  getDeadline(),
  tradeAccountSeqno,
  Address.parse(poolAddress),
  seedCell,
  {
    receiverAddress: Address.parse(userAddress),
    token0Amount: toBigInt(token0Amount, token0Decimals),
    token1Amount: toBigInt(token1Amount, token1Decimals),
  },
)
```
