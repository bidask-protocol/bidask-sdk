/**
 * Returns the greatest common divisor of two positive big integers using the Euclidean algorithm.
 */
export function greatestCommonDivisor(a: bigint, b: bigint): bigint {
  let x = a
  let y = b
  while (y !== 0n) {
    const r = x % y
    x = y
    y = r
  }
  return x
}
