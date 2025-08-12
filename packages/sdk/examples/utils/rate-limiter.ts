let lastExecutionTime = 0

export async function rateLimiter<T>(promise: Promise<T>, delayMs = 100): Promise<T> {
  const now = Date.now()
  const timeSinceLastExecution = now - lastExecutionTime
  const waitTime = Math.max(0, delayMs - timeSinceLastExecution)

  if (waitTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitTime))
  }

  const result = await promise

  lastExecutionTime = Date.now()

  return result
}
