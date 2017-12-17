import {Injectable} from '@angular/core';
import axios from 'axios';
import {AuthCredentialsService} from "./auth-credentials/auth-credentials.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {SessionStateService} from "../global/session-state.service";

@Injectable()
export class AuthServerService {

  constructor(private sessionStateService: SessionStateService) {
  }

  public loginUser(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      axios.post(AuthCredentialsService.AUTH_SERVER_URL, data).then(
        (response) => {
          console.log(response);
          if (response['code'] && response['code'] !== 419) {
            response['data'].token = response['token'];
            this.sessionStateService.save('user', response['data']);
            this.sessionStateService.isLoggedIn = true;
          }
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

}
