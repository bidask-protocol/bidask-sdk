import { KeyPair } from '@ton/crypto'
import { internal, OpenedContract, SendMode, WalletContractV5R1 } from '@ton/ton'

import { TxParams } from '../../src'

export async function sendMultipleTransactions(
  walletOpened: OpenedContract<WalletContractV5R1>,
  walletKeypair: KeyPair,
  txParams: TxParams[],
) {
  const seqno = await walletOpened.getSeqno()

  const transaction = walletOpened.createTransfer({
    messages: txParams.map((tx) => internal({ value: tx.value, body: tx.payload, to: tx.to })),
    seqno,
    authType: 'external',
    secretKey: walletKeypair.secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
  })

  await walletOpened.send(transaction)
}
