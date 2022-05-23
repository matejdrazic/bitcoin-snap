import * as bip32 from 'bip32';
import { networks } from 'bitcoinjs-lib';

const HIGHEST_BIT = 0x80000000

export const getxPubKey = async (wallet, addressType, network = networks.testnet) => {
    switch (addressType) {
        case 'P2PKH':
            const result = await wallet.request({
                method: 'snap_confirm',
                params: [
                    {
                        prompt: 'Access extended public key?',
                        message: 'Would you like this dapp to access your extended public key?'
                    }
                ]
            });

            if (!result) throw new Error('The user rejected access to their extended public key')

            const accountNode = await getMetaMaskEntropy(wallet, network)
            const accountPubKey = accountNode.neutered()
            return accountPubKey.toBase58()
        case 'P2PSH':
            return 'placeholder'
        case 'BECH32':
            return 'placeholder'
        default:
            return `Address of type ${addressType} not supported`

    }
}

export const getMetaMaskEntropy = async (wallet, network = networks.testnet) => {
    const CoinType = 0;
    const rpcMethodName = `snap_getBip44Entropy_${CoinType}`
    const bip44node = await wallet.request({ methods: rpcMethodName })
    const keyBuffer = Buffer.from(bip44node.key, "base64")
    const privateKeyBuffer = keyBuffer.slice(0, 32)
    const chainCodeBuffer = keyBuffer.slice(32, 64)
    const node = bip32.fromPrivateKey(privateKeyBuffer, chainCodeBuffer, network)
    node.__DEPTH = 2
    node.__INDEX = HIGHEST_BIT + 0
    return node.deriveHardened(0)
}