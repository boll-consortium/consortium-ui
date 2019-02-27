import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {SessionStateService} from "./global/session-state.service";
import {isNullOrUndefined} from "util";
import {HttpInterceptorService} from "./http/http-interceptor.service";
import {AuthCredentialsService} from "./auth/auth-credentials/auth-credentials.service";

@Injectable()
export class DbService implements OnInit {
  ngOnInit(): void {
  }

  constructor(private sessionStateService: SessionStateService,
              private httpInterceptorService: HttpInterceptorService,
              private authCredentialsService: AuthCredentialsService) {
  }

  getLearners(blockchainAddress: string, token: string): Observable<any> {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL + 'sb/smart-contract/learners', {
      data: {},
      headers: {
        'Authorization':  btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        console.log("responseLearners: ", response);
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  getSchools(blockchainAddress: string, token: string): Observable<any> {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL + 'sb/smart-contract/schools', {
      data: {},
      headers: {
        'Authorization':  btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        console.log("responseSchools: ", response);
        if (!isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['schools'])) {
          this.sessionStateService.addSchools(response['data']['schools']);
        }
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  getSchool(blockchainAddress: string, token: string, schoolAddress: string): Observable<any> {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL + 'sb/smart-contract/school', {
      data: {},
      params: {schoolAddress: schoolAddress},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        console.log("responseSchools: ", response);
        if (!isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['school'])) {
          this.sessionStateService.addSchool(response['data']['school']);
        }
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }


  updateUserAccounts(accounts: string[]): Observable<any> {
    const result = new ReplaySubject(1);
    this.httpInterceptorService.axiosInstance.post(AuthCredentialsService.AUTH_SERVER_URL + 'users/addAccount/' + this.sessionStateService.getUser().uid, {
      accounts: accounts
    }).then((response => {
      result.next(response);
      response['data']['token'] = this.sessionStateService.getUser()['token'];
      this.sessionStateService.save('user', response['data']);
    })).catch((error) => {
      console.log(error);
    });
    return result;
  }
}
