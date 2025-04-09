export function getDeadline(ttlMs: number = 1000 * 60 * 1): number {
  return Math.floor((Date.now() + ttlMs) / 1000)
}
