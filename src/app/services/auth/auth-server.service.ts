import {Injectable} from '@angular/core';
import {AuthCredentialsService} from "./auth-credentials/auth-credentials.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {SessionStateService} from "../global/session-state.service";
import {HttpInterceptorService} from "../http/http-interceptor.service";

@Injectable()
export class AuthServerService {

  constructor(private sessionStateService: SessionStateService,
              private httpInterceptorService: HttpInterceptorService) {
  }

  public loginUser(data: any) {
    const observer = new ReplaySubject(2);
    if (data) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_LOGIN, data).then(
        (response) => {
          observer.next(response);
        }).catch((error) => {
        console.log(error);
        observer.next(error);
      });
    }
    return observer;
  }

  public loginUserByToken(token: string, bollAddress: string) {
    const observer = new ReplaySubject(2);
    if (token) {
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_LOGIN_BY_TOKEN, {
        token: token,
        bollAddress: bollAddress
      }).then(
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
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_REGISTER_INSTITUTE, data).then(
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
      this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL_REGISTER_LEARNER, data).then(
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
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_READ_LOGS, {
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

  public getLogsBySchool(blockchainAddress: string, token: string, schoolAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_READ_SCHOOL_LOGS, {
      data: {},
      params: {schoolAddress: schoolAddress},
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

  public getLatestLogs(blockchainAddress: string, token: string, schoolAddress: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL_READ_LATEST_LOG, {
      data: {},
      params: {schoolAddress: schoolAddress},
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
