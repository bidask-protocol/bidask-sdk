import { beginCell } from '@ton/ton'

export function createSeedCell(seed: number) {
  return beginCell().storeUint(seed, 64).endCell()
}
