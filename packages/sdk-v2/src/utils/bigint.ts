export const toBigInt = (amount: number | string, decimals: number | string): bigint => {
  const decimalsNumber = Number(decimals)
  const multiplier = BigInt(10) ** BigInt(decimalsNumber)

  let amountString: string
  if (typeof amount === 'string') {
    amountString = amount
  } else {
    amountString = amount.toFixed(decimalsNumber)
  }

  const [integerPart, fractionalPart = ''] = String(amountString).split('.')
  const fractionStr = (fractionalPart + '0'.repeat(decimalsNumber)).slice(0, decimalsNumber)
  return BigInt(integerPart) * multiplier + BigInt(fractionStr)
}

export const fromBigInt = (amount: number | string | bigint, decimals: number | string): string => {
  const amountStr = BigInt(amount).toString()
  const decimalsNumber = Number(decimals)

  if (decimalsNumber === 0) return amountStr

  const padded = amountStr.padStart(decimalsNumber + 1, '0')
  const integerPart = padded.slice(0, -decimalsNumber) || '0'
  const fractionalPart = padded.slice(-decimalsNumber)

  // Remove trailing zeros
  const trimmedFractional = fractionalPart.replace(/0+$/, '')

  return trimmedFractional ? `${integerPart}.${trimmedFractional}` : integerPart
}
