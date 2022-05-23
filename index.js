import { networks } from 'bitcoinjs-lib'
import { getxPubKey } from './rpc_methods/getXPubKey'
import { signPsbt } from './rpc_methods/signPSBT';

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'btc_getxPubKey':
      return getxPubKey(wallet, requestObject.params.addressType, networks.testnet)
    case 'btc_signPsbt': 
      const psbt = requestObject.params.psbt;
      return signPsbt(psbt, wallet, networks.testnet)
    default:
      throw new Error('Method not found.');
  }
});
