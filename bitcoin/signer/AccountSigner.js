

export default class AccountSigner {
    constructor(accountNode) {
        this.node = accountNode
        this.pubKey = this.node.publicKey
        this.fingerprint = this.node.fingerprint
    }

    derivePath(path) {

        try {

            let splitPath = path.split('/')
            if (splitPath[0] = 'm') {
                splitPath = splitPath.slice(1)
            }
            const childNode = splitPath.reduce((prevHd, indexStr) => {
                let index;
                if (indexStr.slice(-1) === `'`) {
                    index = parseInt(indexStr.slice(0, -1))
                    return prevHd.deriveHardened(index)
                } else {
                    index = parseInt(indexStr, 10)
                    return prevHd.derive(index)
                }
            }, this.node)
            return new AccountSigner(childNode)
        } catch (e) {
            throw new Error(e)
        }
    }
}