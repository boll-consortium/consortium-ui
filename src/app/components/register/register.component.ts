import {Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";
import {AuthService} from "angular2-social-login";
import {AuthServerService} from "../../services/auth/auth-server.service";
import {Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public errorMessage: string;
  public successMessage: string;
  public schoolName: string;
  public schoolWebsite: string;
  public blockchainAddress: string;
  public email: string;
  public bollAddress: string;
  public password: string;
  public cpassword: string;
  public username: string;
  public advancedRegistrationEnabled: boolean;
  public userId: string;
  public sessionToken: string;
  public loading: boolean;

  constructor(public sessionStateService: SessionStateService,
              private _auth: AuthService, private _authServer: AuthServerService,
              private router: Router, private meta: Meta) {
  }

  ngOnInit() {
    if (this.sessionStateService.getUser()) {
      this.router.navigateByUrl("/");
    } else {
      console.log("kkkkkkkkkkkkkkkkk", this.sessionStateService.user);
    }
    this.bollAddress = this.meta.getTag('name= "bollAddress"') !== null ? this.meta.getTag('name= "bollAddress"')
      .getAttribute("content") : null;
    this.sessionToken = this.meta.getTag('name= "sessionToken"') !== null ? this.meta.getTag('name= "sessionToken"')
      .getAttribute("content") : null;
    this.userId = this.meta.getTag('name= "userId"') !== null ? this.meta.getTag('name= "userId"')
      .getAttribute("content") : null;
    this.advancedRegistrationEnabled = this.meta.getTag('name= "advancedRegistrationEnabled"').getAttribute("content") === 'true';
  }

  register() {
    if (!isNullOrUndefined(this.sessionToken) && !isNullOrUndefined(this.userId)) {
      if (!isNullOrUndefined(this.password) && this.password === this.cpassword &&
        (this.advancedRegistrationEnabled || !isNullOrUndefined(this.username))) {
        this.errorMessage = "";
        this.successMessage = "";
        this.loading = true;
        this._authServer.registerLearner({password: this.password, cpassword: this.cpassword,
          username: this.username, token: this.sessionToken}).subscribe(response => {
          console.log(response);
          this.loading = false;
          if (response['data']['code'] === 200) {
            this.successMessage = response['data']['message'];
            this.sessionStateService.save('user', {
              accounts: [response['data']['bollAddress']],
              token: response['data']['token'],
              isAdmin: response['data']['isAdmin']
            });
            this.sessionStateService.isLoggedIn = true;
            this.router.navigateByUrl("/");
          }else {
            this.errorMessage = response['data']['message'];
          }
        });
      } else {
        this.errorMessage = isNullOrUndefined(this.username) ? "Username is required" :
          isNullOrUndefined(this.password) ? "Password is required" : "Passwords do not match";
      }
    } else {
      if (!isNullOrUndefined(this.email) && !isNullOrUndefined(this.schoolName) && !isNullOrUndefined(this.schoolWebsite) &&
        !isNullOrUndefined(this.blockchainAddress)) {
        this.errorMessage = "";
        this.successMessage = "";
        this.loading = true;
        this._authServer.registerInstitute({contactEmail: this.email, name: this.schoolName,
          websiteAddress: this.schoolWebsite, blockchainAddress: this.blockchainAddress}).subscribe(response => {
          console.log(response);
          this.loading = false;
          if (response['data']['code'] === 200) {
            this.successMessage = response['data']['message'];
          }else {
            this.errorMessage = response['data']['message'];
          }
        });
      } else {
        this.errorMessage = isNullOrUndefined(this.email) ? "Email Address is required" :
          isNullOrUndefined(this.schoolName) ? "Institution Name is required" :
            isNullOrUndefined(this.blockchainAddress) ? "A blockchain Address is required." : "Institution's official URL is required";
      }
    }
  }
}
