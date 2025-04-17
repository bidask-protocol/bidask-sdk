import { LiquidityProvideBins } from '../../../types/liquidity'

/**
 * -2: [0,y]
 * -1: [0,y]
 * 0: [x,y] (active bin)
 * 1: [x,0]
 * 2: [x,0]
 */
export function normalizeBinsAmounts(
  bins: LiquidityProvideBins,
  totalAmount0: bigint,
  totalAmount1: bigint,
): LiquidityProvideBins {
  const entries = Object.entries(bins).sort((a, b) => {
    const [binA] = a
    const [binB] = b
    return Number(binA) - Number(binB)
  })

  const clonedBins = Object.fromEntries<[bigint, bigint]>(
    entries.map(([bin, [x, y]]) => [bin, [x, y]]),
  )

  const { sumX, sumY } = Object.values<[bigint, bigint]>(clonedBins).reduce(
    (acc, [x, y]) => ({
      sumX: acc.sumX + x,
      sumY: acc.sumY + y,
    }),
    { sumX: 0n, sumY: 0n },
  )

  // Adjust token1 amounts
  if (totalAmount1 < sumY) {
    let diff = sumY - totalAmount1

    // Remove excess from leftmost bins
    for (const [bin, [, y]] of entries) {
      if (y > 0) {
        if (y >= diff) {
          clonedBins[bin][1] -= diff
          break
        } else {
          diff -= y
          clonedBins[bin][1] = 0n
        }
      }
    }
  } else if (totalAmount1 > sumY) {
    const diff = totalAmount1 - sumY
    // Add missing amount to the rightmost bin
    for (let i = entries.length - 1; i >= 0; i--) {
      const [bin, [, y]] = entries[i]

      if (y > 0) {
        clonedBins[bin][1] += diff
        break
      }
    }
  }

  // Adjust token0 amounts
  if (totalAmount0 < sumX) {
    let diff = sumX - totalAmount0
    // Remove excess from rightmost bins
    for (let i = entries.length - 1; i >= 0; i--) {
      const [bin, [x]] = entries[i]

      if (x > 0) {
        if (x >= diff) {
          clonedBins[bin][0] -= diff
          break
        } else {
          diff -= x
          clonedBins[bin][0] = 0n
        }
      }
    }
  } else if (totalAmount0 > sumX) {
    const diff = totalAmount0 - sumX
    // Add missing amount to the rightmost bin
    for (const [bin, [x]] of entries) {
      if (x > 0) {
        clonedBins[bin][0] += diff
        break
      }
    }
  }

  return clonedBins
}
