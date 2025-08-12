import { Address } from '@ton/ton'
import { createInterface } from 'readline/promises'

/**
 * Gets pool address from environment variable or prompts user for input
 * @returns Promise<Address> - The pool address
 */
export async function getPoolAddress(): Promise<Address> {
  // Check if POOL_ADDRESS is set in environment
  if (process.env.POOL_ADDRESS) {
    return Address.parse(process.env.POOL_ADDRESS)
  }

  // If not in env, prompt user for input
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const poolAddressInput = await rl.question('Enter pool address: ')
  rl.close()

  return Address.parse(poolAddressInput)
}