import BigNumber from 'bignumber.js'

import { LiquidityProvideBins, ShapeCreatorResult } from '../../../types/liquidity'
import { toBigInt } from '../../bigint'

BigNumber.config({
  POW_PRECISION: 80,
  DECIMAL_PLACES: 80,
})

function bigNumberIntoBigint(x: BigNumber): bigint {
  return toBigInt(x.toFixed(0, BigNumber.ROUND_DOWN))
}

//////////////////////////////////////////////////////////////////

function getLiquidityX(x: BigNumber, sa: BigNumber, sb: BigNumber): BigNumber {
  return x.multipliedBy(sa).multipliedBy(sb).dividedBy(sb.minus(sa))
}

function getLiquidityY(y: BigNumber, sa: BigNumber, sb: BigNumber): BigNumber {
  return y.dividedBy(sb.minus(sa))
}

function getLiquidity(
  x: BigNumber,
  y: BigNumber,
  sp: BigNumber,
  sa: BigNumber,
  sb: BigNumber,
): BigNumber {
  if (sp.lte(sa)) {
    return getLiquidityX(x, sa, sb)
  }

  if (sp.lt(sb)) {
    return BigNumber.min(getLiquidityX(x, sp, sb), getLiquidityY(y, sa, sp))
  }

  return getLiquidityY(y, sa, sb)
}

function calculateX(L: BigNumber, sp: BigNumber, sa: BigNumber, sb: BigNumber): BigNumber {
  return L.multipliedBy(sb.minus(sp)).dividedBy(sp.multipliedBy(sb))
}

function calculateY(L: BigNumber, sp: BigNumber, sa: BigNumber, sb: BigNumber): BigNumber {
  return L.multipliedBy(sp.minus(sa))
}

//////////////////////////////////////////////////////////////////

function getPriceBounds(bin: number, binStep: number): [BigNumber, BigNumber] {
  const basis = 1 + binStep
  return [
    BigNumber(basis).pow(bin).sqrt(),
    BigNumber(basis)
      .pow(bin + 1)
      .sqrt(),
  ]
}

function countBetween(a: number, b: number): number {
  return Math.abs(b - a) + 1
}

function arithmeticProgressionSum(a: number, b: number): BigNumber {
  return BigNumber(a + b)
    .multipliedBy(countBetween(a, b))
    .dividedBy(2)
}

function bidaskBinHeight(bin: number, currentBin: number): number {
  return countBetween(currentBin, bin)
}

function curveBinHeight(bin: number, farestBin: number, currentBin: number): number {
  return countBetween(farestBin, currentBin) - Math.abs(bin - currentBin)
}

function bidaskSum(fromBin: number, toBin: number, currentBin: number): BigNumber {
  return arithmeticProgressionSum(
    bidaskBinHeight(fromBin, currentBin),
    bidaskBinHeight(toBin, currentBin),
  )
}

function curveSum(fromBin: number, toBin: number, currentBin: number): BigNumber {
  let farestBin: number

  if (Math.abs(fromBin - currentBin) > Math.abs(toBin - currentBin)) {
    farestBin = fromBin
  } else {
    farestBin = toBin
  }

  return arithmeticProgressionSum(
    curveBinHeight(fromBin, farestBin, currentBin),
    curveBinHeight(toBin, farestBin, currentBin),
  )
}

function getHeight(
  shape: 'spot' | 'curve' | 'bidask',
  bin: number,
  currentBin: number,
  farestBin: number,
): number {
  switch (shape) {
    case 'spot':
      return 1
    case 'curve':
      return curveBinHeight(bin, farestBin, currentBin)
    case 'bidask':
      return bidaskBinHeight(bin, currentBin)
    default:
      throw new Error(`Unknown shape: ${shape}`)
  }
}

//////////////////////////////////////////////////////////////////

export function shapeCreator(
  x: BigNumber,
  y: BigNumber,
  autocomplete: 'x' | 'y' | null,
  shape: 'spot' | 'curve' | 'bidask',
  fromBin: number,
  toBin: number,
  baseRatio: number,
  fallbackRatio: number,
  curBin: number,
  sqrtP: BigNumber,
  binStep: number,
): ShapeCreatorResult {
  if (baseRatio < 0 || baseRatio > 1) {
    throw new Error('Base ratio must be between 0 and 1')
  }

  if (fallbackRatio < 0 || fallbackRatio > 1) {
    throw new Error('Fallback ratio must be between 0 and 1')
  }

  if (fromBin > toBin) {
    throw new Error('fromBin must be less than or equal to toBin')
  }

  const amount: [BigNumber, BigNumber] = [y, x]

  const [pa, pb] = getPriceBounds(curBin, binStep)

  const nearestToCurrent: [number, number] = [
    Math.min(toBin, curBin - 1),
    Math.max(curBin + 1, fromBin),
  ]

  let units: [BigNumber, BigNumber]
  switch (shape) {
    case 'spot':
      units = [
        BigNumber(countBetween(fromBin, nearestToCurrent[0])),
        BigNumber(countBetween(nearestToCurrent[1], toBin)),
      ]
      break
    case 'bidask':
      units = [
        bidaskSum(fromBin, nearestToCurrent[0], curBin),
        bidaskSum(nearestToCurrent[1], toBin, curBin),
      ]
      break
    case 'curve':
      units = [
        curveSum(fromBin, nearestToCurrent[0], curBin),
        curveSum(nearestToCurrent[1], toBin, curBin),
      ]
      break
    default:
      throw new Error(`Unknown shape: ${shape}`)
  }

  if (fromBin >= curBin) {
    units[0] = BigNumber(0)
  }

  if (toBin <= curBin) {
    units[1] = BigNumber(0)
  }

  const twoSided = fromBin <= curBin && curBin <= toBin
  let inCurBin: [BigNumber, BigNumber]
  if (twoSided) {
    const singleL = getLiquidity(BigNumber(1), BigNumber(1), sqrtP, pa, pb)
    const share: [BigNumber, BigNumber] = [
      calculateY(singleL, sqrtP, pa, pb),
      calculateX(singleL, sqrtP, pa, pb),
    ]
    const perUnit: [BigNumber, BigNumber] = [
      units[0].plus(share[0]).eq(0) ? BigNumber(0) : amount[0].dividedBy(units[0].plus(share[0])),
      units[1].plus(share[1]).eq(0) ? BigNumber(0) : amount[1].dividedBy(units[1].plus(share[1])),
    ]
    const curveMagnitude: [number, number] = [
      countBetween(fromBin, curBin),
      countBetween(curBin, toBin),
    ]
    const inCurBinPotential: [BigNumber, BigNumber] = [
      perUnit[0].multipliedBy(share[0]).multipliedBy(shape === 'curve' ? curveMagnitude[0] : 1),
      perUnit[1].multipliedBy(share[1]).multipliedBy(shape === 'curve' ? curveMagnitude[1] : 1),
    ]

    const potentialL: [BigNumber, BigNumber] = [
      sqrtP.eq(pa) ? BigNumber(0) : getLiquidityY(inCurBinPotential[0], pa, sqrtP),
      sqrtP.eq(pb) ? BigNumber(0) : getLiquidityX(inCurBinPotential[1], sqrtP, pb),
    ]

    let L: BigNumber
    if (autocomplete === null) {
      if (potentialL[0].gt(potentialL[1])) {
        L = getLiquidity(
          amount[1].multipliedBy(baseRatio).plus(inCurBinPotential[1].multipliedBy(1 - baseRatio)),
          inCurBinPotential[0].multipliedBy(baseRatio).plus(amount[0].multipliedBy(1 - baseRatio)),
          sqrtP,
          pa,
          pb,
        )
      } else {
        L = getLiquidity(
          amount[1].multipliedBy(1 - baseRatio).plus(inCurBinPotential[1].multipliedBy(baseRatio)),
          inCurBinPotential[0].multipliedBy(1 - baseRatio).plus(amount[0].multipliedBy(baseRatio)),
          sqrtP,
          pa,
          pb,
        )
      }

      // Check if either token amount equals full provision
      const tempInCurBin = [calculateY(L, sqrtP, pa, pb), calculateX(L, sqrtP, pa, pb)]

      const fallbackByTokenX = toBin > curBin && tempInCurBin[1].gte(amount[1])
      const fallbackByTokenY = fromBin < curBin && tempInCurBin[0].gte(amount[0])

      if (fallbackByTokenX || fallbackByTokenY) {
        if (potentialL[0].gt(potentialL[1])) {
          L = getLiquidity(
            amount[1]
              .multipliedBy(fallbackRatio)
              .plus(inCurBinPotential[1].multipliedBy(1 - fallbackRatio)),
            inCurBinPotential[0]
              .multipliedBy(fallbackRatio)
              .plus(amount[0].multipliedBy(1 - fallbackRatio)),
            sqrtP,
            pa,
            pb,
          )
        } else {
          L = getLiquidity(
            amount[1]
              .multipliedBy(1 - fallbackRatio)
              .plus(inCurBinPotential[1].multipliedBy(fallbackRatio)),
            inCurBinPotential[0]
              .multipliedBy(1 - fallbackRatio)
              .plus(amount[0].multipliedBy(fallbackRatio)),
            sqrtP,
            pa,
            pb,
          )
        }
      }
    } else if (autocomplete === 'x') {
      L = potentialL[0]
    } else {
      L = potentialL[1]
    }
    inCurBin = [calculateY(L, sqrtP, pa, pb), calculateX(L, sqrtP, pa, pb)]

    if (autocomplete === 'x') {
      perUnit[1] = perUnit[0].dividedBy(sqrtP.pow(2))
      amount[1] = perUnit[1].multipliedBy(units[1].plus(share[1]))
    } else if (autocomplete === 'y') {
      perUnit[0] = perUnit[1].multipliedBy(sqrtP.pow(2))
      amount[0] = perUnit[0].multipliedBy(units[0].plus(share[0]))
    }
  } else {
    inCurBin = [BigNumber(0), BigNumber(0)]
  }

  const rest: [BigNumber, BigNumber] = [amount[0].minus(inCurBin[0]), amount[1].minus(inCurBin[1])]

  const perUnit: [BigNumber, BigNumber] = [
    units[0].eq(0) ? BigNumber(0) : rest[0].dividedBy(units[0]),
    units[1].eq(0) ? BigNumber(0) : rest[1].dividedBy(units[1]),
  ]

  const bins = {} as LiquidityProvideBins
  let totalY = 0n
  let totalX = 0n
  for (let bin = fromBin; bin <= toBin; bin++) {
    if (bin < curBin) {
      const tokenY = perUnit[0].multipliedBy(getHeight(shape, bin, curBin, fromBin))
      const tokenYBigint = bigNumberIntoBigint(tokenY)
      bins[bin] = [0n, tokenYBigint]
      totalY += tokenYBigint
    } else if (bin === curBin) {
      const yBigint = bigNumberIntoBigint(inCurBin[0])
      const xBigint = bigNumberIntoBigint(inCurBin[1])
      bins[bin] = [xBigint, yBigint]
      totalY += yBigint
      totalX += xBigint
    } else {
      const tokenX = perUnit[1].multipliedBy(getHeight(shape, bin, curBin, toBin))
      const tokenXBigint = bigNumberIntoBigint(tokenX)
      bins[bin] = [tokenXBigint, 0n]
      totalX += tokenXBigint
    }
  }

  if (autocomplete !== 'y' && amount[0].lt(totalY)) {
    throw new Error(`Total Y (${totalY.toString()}) exceeds amount Y (${amount[0].toString()})`)
  }

  if (autocomplete !== 'x' && amount[1].lt(totalX)) {
    throw new Error(`Total X (${totalX.toString()}) exceeds amount X (${amount[1].toString()})`)
  }

  return { bins, token0Amount: totalX, token1Amount: totalY }
}
