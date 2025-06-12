/**
 * Generates a random uint64 query ID for transactions
 * @returns A random BigInt value suitable for use as a query ID
 */
export function generateRandomQueryId(): bigint {
  // TON has precision limitations, so we generate within safe 53-bit range
  // to avoid number truncation (similar to JavaScript's MAX_SAFE_INTEGER)
  const buffer = new Uint32Array(2)
  crypto.getRandomValues(buffer)

  // Use only 53 bits to ensure TON doesn't truncate the number
  // Take 21 bits from first value and 32 bits from second value (21 + 32 = 53)
  const high = BigInt(buffer[0] & 0x1fffff) << 32n // Mask to 21 bits
  const low = BigInt(buffer[1])

  return high | low
}
