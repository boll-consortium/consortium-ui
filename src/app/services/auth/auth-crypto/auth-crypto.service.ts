import {Injectable} from '@angular/core';
import lightwallet from 'eth-lightwallet';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";


@Injectable()
export class AuthCryptoService {
  private password: string;

  constructor() {
  }

  generateSeedPhrase(): string {
    return lightwallet.keystore.generateRandomSeed();
  }

  createKeyVault(password, seedPhrase): ReplaySubject<any> {
    const observer = new ReplaySubject(1);
    this.password = password;
    lightwallet.keystore.createVault({
      password: password,
      seedPhrase: seedPhrase,
      hdPathString: "m/44'/60'/0'/0"    // Optional custom HD Path String
    }, (err, ks) => {
      if (err) {
        observer.error(err);
      }
      observer.next(ks);
      console.log(ks);
    });
    return observer;
  }

  getPasswordKey(keystore): ReplaySubject<any> {
    const observer = new ReplaySubject(1);
    keystore.keyFromPassword(this.password, (err, pwDerivedKey) => {
      if (err) {
        observer.error(err);
      }
      console.log("pwDerivedKey: ", pwDerivedKey);
      return observer.next(pwDerivedKey);
    });
    return observer;
  }

  signMessage(keystore, pwDerivedKey, message, address, hdPathString): string {
    return lightwallet.signing.signMsg(keystore, pwDerivedKey, message, address, hdPathString);
  }

}
