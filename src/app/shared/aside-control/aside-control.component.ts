import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";
import {AuthCryptoService} from "../../services/auth/auth-crypto/auth-crypto.service";
import {EthCommunicationService} from "../../services/contract/eth-communication.service";
import {DbService} from "../../services/db.service";

@Component({
  selector: 'app-aside-control',
  templateUrl: './aside-control.component.html',
  styleUrls: ['./aside-control.component.css']
})
export class AsideControlComponent implements OnInit, AfterViewChecked {
  public user: any;
  public password: string;
  public passwordConfirm: string;
  private passwordDerivedKey;
  public errorType: number;
  public showAccountForm: boolean;
  public seedPhrase: string = null;
  private keystore: any;
  public activeAccount: string;
  private accounts: string [];
  public accountToUnlock: string = null;
  constructor(public sessionStateService: SessionStateService,
              private cryptoAuth: AuthCryptoService,
              private ethCommunicationService: EthCommunicationService,
              private dbService: DbService,
              private cd: ChangeDetectorRef
              ) { }

  ngOnInit() {
    this.refreshUser();
    console.log(this.user);
  }

  ngAfterViewChecked(): void {
    this.refreshUser();
    this.cd.detectChanges();
  }

  refreshUser(): void {
    this.user = this.sessionStateService.getUser();
    this.showAccountForm = this.user !== undefined && this.user !== null ? this.user['accounts'] === undefined : true;
  }
  createAccount(): void {
    if (this.password === null || this.password === undefined) {
      this.errorType = 1;
    } else if (this.passwordConfirm === null || this.passwordConfirm === undefined) {
      this.errorType = 2;
    } else if (this.password !== this.passwordConfirm) {
      this.errorType = 3;
    } else {
      this.cryptoAuth.createKeyVault(this.password, this.cryptoAuth.generateSeedPhrase()).subscribe((response) => {
        this.keystore = response;
        this.ethCommunicationService.getPwDerivedKey(this.keystore, this.password).subscribe((passwordDerivedKey => {
          this.passwordDerivedKey = passwordDerivedKey;
          this.generatePublicKeys(1);
          this.ethCommunicationService.init(this.keystore, passwordDerivedKey, this.activeAccount);
        }));
      });
    }
  }

  generatePublicKeys(numAddresses): void {
    this.accounts = this.ethCommunicationService.newAddresses(this.keystore, this.passwordDerivedKey, numAddresses);
    this.dbService.updateUserAccounts(this.accounts).subscribe((response => {
      console.log("QQQQQQQQQQQQQ::::::", response);
      this.refreshUser();
    }));
  }

  setSeed(): void {
    this.seedPhrase = this.cryptoAuth.generateSeedPhrase();
  }

  passwordEntered(): void {
    if (this.errorType === 1) {
      if (this.password !== null && this.password !== undefined) {
        this.errorType = 0;
      }
    } else if (this.errorType === 2) {
      if (this.passwordConfirm !== null || this.passwordConfirm !== undefined) {
        this.errorType = 0;
      }
    } else if (this.errorType === 3) {
      if (this.password === this.passwordConfirm && !(this.password === null || this.password === undefined)) {
        this.errorType = 0;
      }
    }
  }

  getRandomBackground(index): string {
    const bgs = ['bg-red', 'bg-blue', 'bg-green', 'bg-black', 'bg-yellow', 'bg-purple', 'bg-orange',
      'bg-red', 'bg-blue', 'bg-green', 'bg-black', 'bg-yellow'];
    return bgs[index % 9];
  }

}
