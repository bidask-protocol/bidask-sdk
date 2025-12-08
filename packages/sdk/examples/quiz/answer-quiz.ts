import { Address, beginCell } from '@ton/ton'

import { QuizContract } from '../../src'
import { setupEnv } from '../utils/setup-env'

async function main() {
  const { client, walletContractOpened } = await setupEnv()

  const quizAddress = Address.parse('kQC7pg0UsTfAuZ6xGSJUUjLPaNWAQdU88a_ENvwo57Pmwd6v')
  const quiz = client.open(QuizContract.createFromAddress(quizAddress))

  const answerCell = beginCell().storeStringTail('qwerty').endCell()

  await quiz.sendExternalAnswer({
    recipientAddress: walletContractOpened.address,
    answer: answerCell,
  })
}

main().catch((error) => {
  console.error(error)
})
