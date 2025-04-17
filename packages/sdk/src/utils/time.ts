/**
 * Gets the deadline for a transaction from the current time
 * @param ttlMs - The time to live in milliseconds
 * @returns The deadline in seconds
 */
export function getDeadline(ttlMs: number = 1000 * 60 * 1): number {
  return Math.floor((Date.now() + ttlMs) / 1000)
}
