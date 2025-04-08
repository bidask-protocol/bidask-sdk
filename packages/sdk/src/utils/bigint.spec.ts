import { describe, expect, it } from 'vitest'

import { fromBigInt, toBigInt } from './bigint'

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
