export const getSqrtPriceX128 = (price: number): bigint => {
  return BigInt(Math.floor(Math.sqrt(price) * 2 ** 128))
}

export const getPriceFromSqrtPriceX128 = (sqrtPriceX128: bigint): number => {
  return (Number(sqrtPriceX128) / 2 ** 128) ** 2
}

export const getNormilizedPrice = (
  price: number,
  jetton0Decimals: number,
  jetton1Decimals: number,
) => {
  return price * 10 ** (jetton0Decimals - jetton1Decimals)
}

export const getDenormalizedPrice = (
  price: number,
  jetton0Decimals: number,
  jetton1Decimals: number,
) => {
  return price / 10 ** (jetton0Decimals - jetton1Decimals)
}
