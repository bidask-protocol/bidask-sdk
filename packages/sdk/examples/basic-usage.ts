import { BIN_STEP_COEFFICIENT, ZERO_ADDRESS } from '../src'

async function main() {
  console.warn('Zero address:', ZERO_ADDRESS.toString())
  console.warn('Bin step coefficient:', BIN_STEP_COEFFICIENT)
}

main().catch(console.error)
