/**
 * Generates a random uint64 query ID for transactions
 * @returns A random BigInt value suitable for use as a query ID
 */
export function generateRandomQueryId(): bigint {
  // Generate a random 64-bit unsigned integer
  // Use crypto.getRandomValues for better randomness
  const buffer = new Uint32Array(2)
  crypto.getRandomValues(buffer)

  // Combine two 32-bit values into a 64-bit value
  const high = BigInt(buffer[0]) << 32n
  const low = BigInt(buffer[1])

  return high | low
}
