import { Psbt } from "bitcoinjs-lib";
import secp256k1 from 'secp256k1';

const validator = (pubKey, msgHash, signature) => {
    return secp256k1.ecdsaVerify(new Uint8Array(signature), msgHash, new Uint8Array(msgHash), new Uint8Array(pubKey))
}

export class BitcoinTx {
    constructor(base64psbt) {
        this.tx = Psbt.fromBase64(base64psbt)
    }

    validateTx(accountSigner) {
        let result = true;
        // because of how BTC handles txs
        this.tx.txInputs.forEach((each, index) => {
            result = this.tx.inputHasHDKey(index, accountSigner)
        });
        return result;
    }

    // shows the content of the transaction
    extractPsbtJson() {
        return {
            inputs: this.tx.txInputs.map(each => ({
                prevTxId: each.hash.toString('hex'),
                index: each.index,
                sequence: each.sequence
            })),
            outputs: this.tx.txOutputs.map(each => ({
                script: each.script.toString('hex'),
                value: each.value,
                address: each.address,
            }))
        }
    }

    extractPsbtJsonString() {
        return JSON.stringify(this.extractPsbtJson(), null, 2)
    }

    signTx(accountSigner) {
        this.tx.signAllInputsHD(accountSigner)
        if (this.tx.validateSignaturesOfAllInputs(validator)) {
            this.tx.finalizeAllInputs();
            const txId = this.tx.extractTransaction().getId();
            const txHex = this.tx.extractTransaction().toHex();
            return { txId, txHex };
        } else {
            throw new Error('Signature verification failed.')
        }
    }
}