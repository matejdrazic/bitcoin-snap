import { getMetaMaskEntropy } from "./getXPubKey";
import { networks } from "bitcoinjs-lib";
import { BitcoinTx } from "../bitcoin/bitcoin-tx/BitcoinTx";
import AccountSigner from "../bitcoin/signer/AccountSigner";

export const signPsbt = async (psbt, wallet, network = networks.testnet) => {
    const tx = new BitcoinTx(psbt)
    const result = await wallet.request({
        method: 'snap_confirm',
        params: [
            {
                prompt: 'Sign bitcoin transaction',
                description: 'Please verify transaction details',
                textAreaContent: tx.extractPsbtJsonString()
            }
        ]
    })

    if(result) {
        const accountPrivateKey = await getMetaMaskEntropy(wallet, network)
        const signer = new AccountSigner(accountPrivateKey)
        tx.validateTx(signer)
    } else {
        throw new Error('The user rejected the signing request')
    }
}