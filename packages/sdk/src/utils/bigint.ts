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
  } else if (Number.isFinite(amount)) {
    amountString = numberExponentToLarge(amount)
  } else {
    amountString = '0'
  }

  const [integerPart, fractionalPart = ''] = String(amountString).split('.')
  const fractionStr = (fractionalPart + '0'.repeat(decimalsNumber)).slice(0, decimalsNumber)

  const integerPartBigInt = BigInt(integerPart)
  const fractionalPartBigInt = BigInt(fractionStr)

  return integerPartBigInt * multiplier + fractionalPartBigInt
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

/**
 * Converts a number in exponential (e-Notation) format to a decimal string.
 * @param numIn - The input number, can be a string or number in exponent format.
 * @returns A string representing the decimal number.
 * @remarks No checks are made for NaN or undefined inputs. Non-exponential numbers are returned as is.
 */
export function numberExponentToLarge(numIn: string | number): string {
  const inputStr = String(numIn)
  let sign = ''
  let numStr = inputStr

  // Handle negative numbers
  if (numStr.startsWith('-')) {
    sign = '-'
    numStr = numStr.slice(1)
  }

  // Split at 'e' or 'E' to check for exponent notation
  const parts = numStr.split(/[eE]/)
  if (parts.length < 2) {
    return sign + numStr
  }

  const exponent = Number(parts[1])
  const decimalSeparator = (1.1).toLocaleString().slice(1, 2)
  const baseParts = parts[0].split(decimalSeparator)
  let baseLeft = baseParts[0]
  let baseRight = baseParts[1] || ''

  if (exponent >= 0) {
    // Handle positive exponents by padding and inserting decimal separator
    if (exponent > baseRight.length) {
      baseRight += '0'.repeat(exponent - baseRight.length)
    }
    baseRight = baseRight.slice(0, exponent) + decimalSeparator + baseRight.slice(exponent)
    if (baseRight.endsWith(decimalSeparator)) {
      baseRight = baseRight.slice(0, -1)
    }
  } else {
    // Handle negative exponents by padding and inserting decimal separator
    const deltaZeros = Math.abs(exponent) - baseLeft.length
    if (deltaZeros > 0) {
      baseLeft = '0'.repeat(deltaZeros) + baseLeft
    }
    baseLeft = baseLeft.slice(0, exponent) + decimalSeparator + baseLeft.slice(exponent)
    if (baseLeft.startsWith(decimalSeparator)) {
      baseLeft = '0' + baseLeft
    }
  }

  // Combine parts, remove unnecessary leading/trailing zeros, and return with sign
  return sign + (baseLeft + baseRight).replace(/^0*(\d+|\d+\.\d+?)\.?0*$/, '$1')
}
