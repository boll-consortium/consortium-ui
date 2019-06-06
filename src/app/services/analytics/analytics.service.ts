import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs/Rx";
import {AuthCredentialsService} from "../auth/auth-credentials/auth-credentials.service";
import {SessionStateService} from "../global/session-state.service";
import {HttpInterceptorService} from "../http/http-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private sessionStateService: SessionStateService,
              private httpInterceptorService: HttpInterceptorService) {
  }

  getSchoolsInLLPC(blockchainAddress: string, token: string): Observable<any> {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL + 'sb/smart-contract/llpc/schools', {
      data: {},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        console.log("responseSchools: ", response);
        observer.next(response.data);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  getLLPCEvents(blockchainAddress: string, token: string): Observable<any> {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(AuthCredentialsService.AUTH_SERVER_URL + 'sb/smart-contract/llpc/events', {
      data: {},
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': 'application/json'
      }
    }).then(
      (response) => {
        console.log("llpc events: ", response);
        observer.next(response.data);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }
}
