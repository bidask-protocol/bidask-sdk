
/**
 * Converts a number or string to a bigint
 * @param amount - The amount to convert
 * @param decimals - The number of decimals
 * @returns The bigint value
 */
export const toBigInt = (amount: number | string, decimals: number | string = 0): bigint => {
  const decimalsNumber = Number(decimals)
  const multiplier = BigInt(10) ** BigInt(decimalsNumber)

  let amountString: string
  if (typeof amount === 'string') {
    amountString = amount
  } else {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (decimalsNumber || -1) + '})?')
    amountString = amount.toString().match(re)![0]
  }

  const [integerPart, fractionalPart = ''] = String(amountString).split('.')
  const fractionStr = (fractionalPart + '0'.repeat(decimalsNumber)).slice(0, decimalsNumber)
  return BigInt(integerPart) * multiplier + BigInt(fractionStr)
}

/**
 * Converts a bigint to a string
 * @param amount - The amount to convert
 * @param decimals - The number of decimals
 * @returns The string value
 */
export const fromBigInt = (
  amount: number | string | bigint,
  decimals: number | string = 0,
): string => {
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

/**
 * Converts a buffer to a bigint
 * @param buffer - The buffer to convert
 * @returns The bigint value
 */
export function bufferToBigInt(buffer: Buffer): bigint {
  return BigInt('0x' + buffer.toString('hex'))
}