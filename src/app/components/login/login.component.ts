import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SessionStateService} from "../../services/global/session-state.service";
import {AuthServerService} from "../../services/auth/auth-server.service";
import {isNullOrUndefined} from "util";
import {Meta} from '@angular/platform-browser';
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public username: string;
  public password: string;
  public keyFile: any;
  public linkAccount = true;
  public errorMessage: string;
  public successMessage: string;
  public bollAddress: string;
  public advancedRegistrationEnabled: boolean;
  public userId: string;
  public sessionToken: string;
  public uToken: string;
  public userName: string;
  public loading: boolean;
  public BASE_PATH = AuthCredentialsService.AUTH_SERVER_URL;

  constructor(public sessionStateService: SessionStateService,
              private _authServer: AuthServerService,
              private router: Router, private meta: Meta) {
  }

  ngOnInit() {
    if (this.sessionStateService.getUser()) {
      console.log("sssssssssssssssss");
      this.router.navigateByUrl("/");
      return;
    } else {
      console.log("kkkkkkkkkkkkkkkkk");
    }
    this.bollAddress = this.meta.getTag('name= "bollAddress"') !== null ? this.meta.getTag('name= "bollAddress"')
      .getAttribute("content") : null;
    this.sessionToken = this.meta.getTag('name= "sessionToken"') !== null ? this.meta.getTag('name= "sessionToken"')
      .getAttribute("content") : null;
    this.uToken = this.meta.getTag('name= "uToken"') !== null ? this.meta.getTag('name= "uToken"')
      .getAttribute("content") : null;
    this.uToken = (isNullOrUndefined(this.uToken) && this.meta.getTag('name= "uLoginToken"') !== null) ? this.meta.getTag('name= "uLoginToken"')
      .getAttribute("content") : this.uToken;
    this.userName = (isNullOrUndefined(this.userName) && this.meta.getTag('name= "userName"') !== null) ? this.meta.getTag('name= "userName"')
      .getAttribute("content") : this.userName;
    this.userId = this.meta.getTag('name= "userId"') !== null ? this.meta.getTag('name= "userId"')
      .getAttribute("content") : null;
    this.advancedRegistrationEnabled = this.meta.getTag('name= "advancedRegistrationEnabled"').getAttribute("content") === 'true';
    this.linkAccount = !isNullOrUndefined(this.sessionToken);

    if (!isNullOrUndefined(this.userName) && !isNullOrUndefined(this.bollAddress)) {
      this.username = this.userName;
    }
    if (!isNullOrUndefined(this.uToken) && !isNullOrUndefined(this.bollAddress)) {
      this._authServer.loginUserByToken(this.uToken, this.bollAddress).subscribe(response => {
        console.log(response);
        this.loading = false;
        if (response['status'] === 200 && response['data'].code === 200) {
          this.successMessage = response['data']['message'];
          this.sessionStateService.save('user', {
            accounts: [response['data']['bollAddress']],
            token: response['data']['token']
          });
          this.sessionStateService.isLoggedIn = true;
          this.router.navigateByUrl("/");
        } else {
          //this.errorMessage = response['message'] ? response['message'] : response['data']['message'];
        }
      });
    }
  }

  handleFileInput(files: FileList) {
    this.keyFile = files.item(0);
  }

  login() {
    if (this.advancedRegistrationEnabled) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log(fileReader.result);
      };
      fileReader.readAsText(this.keyFile);
    }
    if (!isNullOrUndefined(this.password) && ((!isNullOrUndefined(this.keyFile) && this.advancedRegistrationEnabled) ||
        (!isNullOrUndefined(this.username) && !this.advancedRegistrationEnabled))) {
      this.errorMessage = "";
      this.successMessage = "";
      const data = {
        'password': this.password,
        'token': this.sessionToken,
        'userId': this.userId,
        'linkAccount': this.linkAccount
      };
      if (this.advancedRegistrationEnabled) {
        data['keyFile'] = JSON.parse(this.keyFile);
      } else {
        data['username'] = this.username;
      }
      this.loading = true;
      this._authServer.loginUser(data).subscribe(response => {
        console.log(response);
        this.loading = false;
        if (response['status'] === 200 && response['data'].code === 200) {
          this.successMessage = response['data']['message'];
          this.sessionStateService.save('user', {
            accounts: [response['data']['bollAddress']],
            token: response['data']['token']
          });
          this.sessionStateService.isLoggedIn = true;
          this.router.navigateByUrl("/");
        } else {
          this.errorMessage = response['message'] ? response['message'] : response['data']['message'];
        }
      });
    } else {
      this.errorMessage = isNullOrUndefined(this.password) ? "Password is required" : this.advancedRegistrationEnabled ?
        "Key File is required" : "Username is required";
    }
  }

  fileChange(e) {
    this.keyFile = e.target.files[0];
  }
}
