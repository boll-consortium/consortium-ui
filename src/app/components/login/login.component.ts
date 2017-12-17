import {Component, OnInit} from '@angular/core';
import {Route, Router} from "@angular/router";
import lightwallet from 'eth-lightwallet';
import {SessionStateService} from "../../services/global/session-state.service";
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";
import {AuthService} from "angular2-social-login";
import {AuthServerService} from "../../services/auth/auth-server.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public sessionStateService: SessionStateService,
              private _auth: AuthService, private _authServer: AuthServerService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.sessionStateService.getUser()) {
      console.log("sssssssssssssssss");
      this.router.navigateByUrl("/");
    } else {
      console.log("kkkkkkkkkkkkkkkkk");
    }
  }

  register(source) {
    switch (source) {
      case AuthCredentialsService.loginSources.GOOGLE:
      case AuthCredentialsService.loginSources.FACEBOOK:
        this._auth.login(source).subscribe(
          (data) => {
            console.log(data);
            if (data) {
              this._authServer.loginUser(data).subscribe(
                (response) => {
                  if (!response['code'] || response['code'] !== 419) {
                    response['data'].token = response['token'];
                    this.sessionStateService.save('user', response['data']);
                    this.sessionStateService.isLoggedIn = true;
                    this.router.navigateByUrl("/");
                  }
                  console.log(response);
                },
                (error) => {
                  console.error(error);
                });
            }
          },
          (error) => {
            console.error(error);
          });
        break;
      case AuthCredentialsService.loginSources.EMAIL:
        break;
      default:
        break;
    }
  }
}
