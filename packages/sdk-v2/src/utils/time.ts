export function getDeadline(ttlMs: number = 1000 * 60 * 1): number {
  return Date.now() + ttlMs
}
