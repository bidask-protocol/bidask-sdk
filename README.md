# Bidask SDK

## Providing Liquidity

### Usage Example

```typescript
import { Address } from "@ton/ton";
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  PoolContract,
  RangeContract,
  JettonMaster,
  normalizeBinsAmount,
  createProvideNativeLiquidityTxParams,
  createProvideLiquidityTxParams,
  getBinByPrice,
  getPriceFromSqrtPriceX128,
  toBigInt,
  isZeroAddress,
  getDeadline,
  BIN_STEP_COEFFICIENT,
  LiquidityType,
  createCurveShape,
} from "@bidask/sdk";

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

// Calculate the bin step in absolute terms
const binStepAbs = Number(selectedPool.bps) / BIN_STEP_COEFFICIENT;

// Convert input amounts to the correct format
const token0AmountNumber = Number(toBigInt(token0Amount, selectedPool.token0.decimals));
const token1AmountNumber = Number(toBigInt(token1Amount, selectedPool.token1.decimals));

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

const token0AmountNormalized = toBigInt(token0Amount, selectedPool.token0.decimals);
const token1AmountNormalized = toBigInt(token1Amount, selectedPool.token1.decimals);

// Create the shape of the bins to provide
// Available options are: createCurveShape, createSpotShape, createBidaskShape
const binsToProvide = createCurveShape({
  token0Amount: token0AmountNormalized,
  token1Amount: token1AmountNormalized,
  currentPrice: currentPrice,
  fromBin: firstBinIndex,
  toBin: lastBinIndex,
  bps: binStep,
})

// Determine liquidity type (single or both tokens)
const liquidityType =
  token0AmountNormalized > 0 && token1AmountNormalized > 0
    ? LiquidityType.TwoSides
    : LiquidityType.OneSide;

// Get token wallet addresses
const jetton0 = await JettonMaster.create(
  Address.parse(selectedPool.token0.address)
);
const jetton0Contract = tonapiClientAdapter.open(jetton0);
const jetton0Wallet = await jetton0Contract.getWalletAddress(
  Address.parse(userAddress)
);

// Handle TON + Jetton case
if (isZeroAddress(selectedPool.token1.address)) {
  // Create transaction parameters for providing TON + Jetton
  const txParams = createProvideNativeLiquidityTxParams({
    poolAddress: pool.address,
    jettonAmount: token0AmountNormalized,
    tonAmount: token1AmountNormalized,
    senderAddress: Address.parse(userAddress),
    liquidityType,
    liquidityDict,
    jettonWalletAddress: jetton0Wallet,
  });

  // Send transaction
  const tx = await tonConnectUI.sendTransaction({
    validUntil: getDeadline(),
    messages: [
      {
        address: txParams.to.toString(),
        amount: txParams.value.toString(),
        payload: txParams.payload.toBoc().toString("base64"),
      },
    ],
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
  const txParams = createProvideLiquidityTxParams({
    poolAddress: pool.address,
    jettonWalletAddress0: jetton0Wallet,
    jettonWalletAddress1: jetton1Wallet,
    jettonAmount0: token0AmountNormalized,
    jettonAmount1: token1AmountNormalized,
    senderAddress: Address.parse(userAddress),
    liquidityType,
    liquidityDict,
  });

  // Send transactions
  const tx = await tonConnectUI.sendTransaction({
    validUntil: getDeadline(),
    messages: txParams.map((tx) => ({
      address: tx.to.toString(),
      amount: tx.value.toString(),
      payload: tx.payload.toBoc().toString("base64"),
    })),
  });
}
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

// Burn all liquidity
if (burnPercentage === 100) {
  const burnAllTxParams = createBurnAllTxParams({ lpMultitokenAddress });

  await tonConnectUI.sendTransaction({
    validUntil: getDeadline(),
    messages: [
      {
        address: burnAllTxParams.to.toRawString(),
        amount: burnAllTxParams.value.toString(),
        payload: burnAllTxParams.payload.toBoc().toString("base64"),
      },
    ],
  });
} else {
  // Burn partial liquidity
  const lpMultitokenContract = tonapiClientAdapter.open(
    LpMultitokenContract.create(lpMultitokenAddress)
  );

  const lpTokenBins = await lpMultitokenContract.getTokens();

  const burnTxParams = createBurnTxParams({
    lpMultitokenAddress,
    binsToBurn: Object.fromEntries(
      Object.entries(lpTokenBins).map(([bin, amount]) => {
        return [Number(bin), (amount * BigInt(burnPercentage)) / 100n];
      })
    ),
  });

  await tonConnectUI.sendTransaction({
    validUntil: getDeadline(),
    messages: [
      {
        address: burnTxParams.to.toRawString(),
        amount: burnTxParams.value.toString(),
        payload: burnTxParams.payload.toBoc().toString("base64"),
      },
    ],
  });
}
```

## Swapping Tokens

### Usage Example

```typescript
import { Address } from "@ton/ton";
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  PoolContract,
  RangeContract,
  JettonMaster,
  JettonWalletContract,
  createTonSwapTxParams,
  createJettonSwapTxParams,
  getPriceFromSqrtPriceX128,
  getSqrtPriceX128,
  toBigInt,
  isZeroAddress,
  getDeadline,
} from "@bidask/sdk";

// The pool you want to swap in
const poolData = {
  poolAddress:
    "0:85e73c7cf6b6434d4ee3f2f2f7e45ed0d594f5a1d71614e674599ce31abc330d",
  bps: 60n,
  token0: {
    address:
      "0:fa0b96ec813ecc248d6505570d99311c6936a565507196bc759014e24aaaca84",
    decimals: "9",
  },
  token1: {
    address:
      "0:0000000000000000000000000000000000000000000000000000000000000000",
    decimals: "9",
  },
};

// Token you're swapping from
const tokenFrom = poolData.token0;

// Amount to swap
const amountFromRaw = "100"; // human readable format
const slippage = 0.01; // 1% slippage

// Create pool contract instance
const pool = PoolContract.create(Address.parse(poolData.poolAddress));
const poolContract = tonapiClientAdapter.open(pool);

// Get current price
const activeRangeAddress = await poolContract.getActiveRange();
const activeRange = RangeContract.create(activeRangeAddress);
const activeRangeContract = tonapiClientAdapter.open(activeRange);
const sqrtPriceX128 = await activeRangeContract.getSqrtPrice();
const currentPrice = getPriceFromSqrtPriceX128(sqrtPriceX128);

// Handle TON swap -> Jetton case
if (isZeroAddress(Address.parse(tokenFrom.address))) {
  const lastPrice = currentPrice * (1 + slippage);

  const swapParams = createTonSwapTxParams({
    poolAddress: pool.address,
    amountIn: toBigInt(amountFromRaw, 9),
    receiverAddress: Address.parse(userAddress),
    lastPrice: getSqrtPriceX128(lastPrice),
  });

  await tonConnectUI.sendTransaction({
    validUntil: getDeadline(),
    messages: [
      {
        address: swapParams.to.toRawString(),
        amount: swapParams.value.toString(),
        payload: swapParams.payload.toBoc().toString("base64"),
      },
    ],
  });
} else {
  // Handle Jetton swap -> Jetton/TON case
  const token0JettonContract = tonapiClientAdapter.open(
    JettonMaster.create(Address.parse(tokenFrom.address))
  );

  const token0UserWallet = await token0JettonContract.getWalletAddress(
    Address.parse(walletAddress)
  );

  const { token0Wallet } = await poolContract.getPoolInfo();

  const poolToken0WalletContract = tonapiClientAdapter.open(
    JettonWalletContract.create(token0Wallet)
  );

  const { jettonMaster } = await poolToken0WalletContract.getWalletData();

  const isToken0Swap = Address.parse(tokenFrom.address).equals(jettonMaster);
  const lastPrice = isToken0Swap
    ? currentPrice * (1 - slippage)
    : currentPrice * (1 + slippage);

  const swapParams = createJettonSwapTxParams({
    poolAddress: pool.address,
    amountIn: toBigInt(amountFromRaw, tokenFrom.decimals),
    tokenIn: token0JettonContract.address,
    receiverAddress: Address.parse(userAddress),
    senderAddress: Address.parse(userAddress),
    jettonWalletAddress: token0UserWallet,
    lastPrice: getSqrtPriceX128(lastPrice),
  });

  await tonConnectUI.sendTransaction({
    validUntil: getDeadline(),
    messages: [
      {
        address: swapParams.to.toRawString(),
        amount: swapParams.value.toString(),
        payload: swapParams.payload.toBoc().toString("base64"),
      },
    ],
  });
}
```
