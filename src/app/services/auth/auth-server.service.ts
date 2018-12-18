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
      axios.post(AuthCredentialsService.AUTH_SERVER_URL_LOGIN, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public registerInstitute(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      axios.post(AuthCredentialsService.AUTH_SERVER_URL_REGISTER_INSTITUTE, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public registerLearner(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      axios.post(AuthCredentialsService.AUTH_SERVER_URL_REGISTER_LEARNER, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public getLogs(blockchainAddress: string, token: string) {
    const observer = new ReplaySubject(2);
      axios.get(AuthCredentialsService.AUTH_SERVER_URL_READ_LOGS, {
        data: {},
        headers: {
          'Authorization': btoa(blockchainAddress + ':' + token),
          'Content-Type': 'application/json'
        }
      }).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    return observer;
  }

}
