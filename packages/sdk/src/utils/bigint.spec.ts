import { describe, expect, it } from 'vitest'

import { fromBigInt, numberExponentToLarge, toBigInt } from './bigint'

describe('toBigInt', () => {
  it('should correctly convert numbers and strings', () => {
    expect(toBigInt(1000)).toEqual(1000n)
    expect(toBigInt('1000')).toEqual(1000n)

    expect(toBigInt(1000, 2)).toEqual(100000n)
    expect(toBigInt('1000', 2)).toEqual(100000n)

    expect(toBigInt(1000.2346, 3)).toEqual(1000234n)
    expect(toBigInt('1000.2346', 3)).toEqual(1000234n)

    expect(toBigInt(1000.2344, 3)).toEqual(1000234n)
    expect(toBigInt('1000.2344', 3)).toEqual(1000234n)

    expect(toBigInt(1000.2344)).toEqual(1000n)
    expect(toBigInt('1000.2344')).toEqual(1000n)

    expect(toBigInt(8e-27)).toEqual(0n)
  })
})

describe('fromBigInt', () => {
  it('should correctly convert bigint to string', () => {
    expect(fromBigInt(1000n, 6)).toEqual('0.001')
    expect(fromBigInt(1000n)).toEqual('1000')
    expect(fromBigInt(1000n, 2)).toEqual('10')
    expect(fromBigInt(1000234n, 3)).toEqual('1000.234')
    expect(fromBigInt(1000234n, 7)).toEqual('0.1000234')
    expect(fromBigInt(1000234n, 10)).toEqual('0.0001000234')
  })
})

describe('numberExponentToLarge', () => {
  it('should correctly convert numbers and strings', () => {
    expect(numberExponentToLarge('123E0')).toEqual('123')
    expect(numberExponentToLarge('-123e+0')).toEqual('-123')
    expect(numberExponentToLarge('123e1')).toEqual('1230')
    expect(numberExponentToLarge('123e3')).toEqual('123000')
    expect(numberExponentToLarge('123e+3')).toEqual('123000')
    expect(numberExponentToLarge('123E+7')).toEqual('1230000000')
    expect(numberExponentToLarge('-123.456e+1')).toEqual('-1234.56')
    expect(numberExponentToLarge('123.456e+4')).toEqual('1234560')
    expect(numberExponentToLarge('123E-0')).toEqual('123')
    expect(numberExponentToLarge('123.456e+50')).toEqual(
      '12345600000000000000000000000000000000000000000000000',
    )

    expect(numberExponentToLarge('123e-0')).toEqual('123')
    expect(numberExponentToLarge('123e-1')).toEqual('12.3')
    expect(numberExponentToLarge('123e-3')).toEqual('0.123')
    expect(numberExponentToLarge('-123e-7')).toEqual('-0.0000123')
    expect(numberExponentToLarge('123.456E-1')).toEqual('12.3456')
    expect(numberExponentToLarge('123.456e-4')).toEqual('0.0123456')
    expect(numberExponentToLarge('123.456e-50')).toEqual(
      '0.00000000000000000000000000000000000000000000000123456',
    )
    expect(numberExponentToLarge('-123.456e-50')).toEqual(
      '-0.00000000000000000000000000000000000000000000000123456',
    )

    expect(numberExponentToLarge('1.e-5')).toEqual('0.00001') // handle missing base fractional part
    expect(numberExponentToLarge('.123e3')).toEqual('123') // handle missing base whole part

    // The Electron's Mass:
    expect(numberExponentToLarge('9.10938356e-31')).toEqual(
      '0.000000000000000000000000000000910938356',
    )
    // The Earth's Mass:
    expect(numberExponentToLarge('5.9724e+24')).toEqual('5972400000000000000000000')
    // Planck constant:
    expect(numberExponentToLarge('6.62607015e-34')).toEqual(
      '0.000000000000000000000000000000000662607015',
    )

    expect(numberExponentToLarge('0.000e3')).toEqual('0')
    expect(numberExponentToLarge('0.000000000000000e3')).toEqual('0')
    expect(numberExponentToLarge('-0.0001e+9')).toEqual('-100000')
    expect(numberExponentToLarge('-0.0e1')).toEqual('-0')
    expect(numberExponentToLarge('-0.0000e1')).toEqual('-0')
  })

  it('should correctly convert numbers and strings', () => {
    expect(numberExponentToLarge('12345.7898')).toEqual('12345.7898') // no exponent
    expect(numberExponentToLarge(12345.7898)).toEqual('12345.7898') // no exponent
    expect(numberExponentToLarge(0.00000000000001)).toEqual('0.00000000000001') // from 1e-14
    expect(numberExponentToLarge(-0.0000000000000345)).toEqual('-0.0000000000000345') // from -3.45e-14
    expect(numberExponentToLarge(-0)).toEqual('0')
    expect(numberExponentToLarge('1.2000e0')).toEqual('1.2')
    expect(numberExponentToLarge('1.2000e-0')).toEqual('1.2')
    expect(numberExponentToLarge('1.2000e+0')).toEqual('1.2')
    expect(numberExponentToLarge('1.2000e+10')).toEqual('12000000000')
  })
})
