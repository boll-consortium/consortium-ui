import {Injectable} from '@angular/core';
import {SessionStateService} from "../global/session-state.service";
import {AuthCryptoService} from "../auth/auth-crypto/auth-crypto.service";
import contract from 'truffle-contract';
import Config from '../../../../config.json';
import web3 from 'web3';
import async from "async";
import {ReplaySubject} from "rxjs/ReplaySubject";
import lightwallet from 'eth-lightwallet';

import SignerProvider from 'ethjs-provider-signer';
import Eth from 'ethjs-query';

@Injectable()
export class EthCommunicationService {
  provider: any;
  eth: any;
  constructor(private sessionStateService: SessionStateService,
              private cryptoAuth: AuthCryptoService) {
  }

  init(keystore, pwDerivedKey, signingAddress): void {
    this.provider = new SignerProvider(Config['base_nodes'][0], {
      signTransaction: (rawTx, cb) => cb(null, lightwallet.signing.signTx(keystore, pwDerivedKey, rawTx, signingAddress))
    });
    this.eth = new Eth(this.provider);
  }

  public getBalances(keystore): ReplaySubject<any> {
    const observer = new ReplaySubject(1);
    const addresses = keystore.getAddresses();
    const response = [];
    async.map(addresses, web3.eth.getBalance, function (err, balances) {
      async.map(addresses, web3.eth.getTransactionCount, function (err2, nonces) {
        document.getElementById('addr').innerHTML = '';
        for (let i = 0; i < addresses.length; ++i) {
          response.push({
            address: addresses[i],
            balance: (balances[i] / 1.0e18),
            nonce: nonces[i]
          });
        }
        observer.next(response);
      });
    });
    return observer;
  }

  newAddresses(keystore, pwDerivedKey, numAddr): string[] {
    keystore.generateNewAddress(pwDerivedKey, numAddr);
    return keystore.getAddresses();
  }

  getPwDerivedKey(keystore, password): ReplaySubject<any> {
    const observer = new ReplaySubject(1);
    keystore.keyFromPassword(password, function (err, pwDerivedKey) {
      observer.next(pwDerivedKey);
    });
    return observer;
  }

}
