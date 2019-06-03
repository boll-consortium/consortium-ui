import {Injectable} from '@angular/core';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {HttpInterceptorService} from "../http/http-interceptor.service";

@Injectable()
export class SettingsService {

  constructor(private httpInterceptorService: HttpInterceptorService) {
  }

  public static SERVER_URL = '../';
  public static GET_BOLL_INSTITUTES = SettingsService.SERVER_URL + 'sb/identity/institutes';
  public static UPDATE_BOLL_INSTITUTE = SettingsService.SERVER_URL + 'sb/identity/institutes/update';
  public static APPROVE_BOLL_INSTITUTES = SettingsService.SERVER_URL + 'sb/identity/create/approve_institute';
  public static UPLOAD_CREDENTIALS_OTHERS = SettingsService.SERVER_URL + 'sb/identity/credentials/upload';
  private HEADERS = {
      'Authorization': btoa("0xff5d3172002a997c77e67ce0cbd8feaafdf66cda:accessToken"),
      'Content-Type': "application/json"
    };


  public getAllInstitutes(bollAddress: string, token: string) {
    const observer = new ReplaySubject(2);
    this.httpInterceptorService.axiosInstance.get(SettingsService.GET_BOLL_INSTITUTES, {
      data: {},
      headers: {
        'Authorization':  btoa(bollAddress + ':' + token),
        'Content-Type': "application/json"
      }
    }).then(
      (response) => {
        console.log(response);
        observer.next(response);
      }).catch((error) => {
      console.log(error);
      observer.next(error);
    });
    return observer;
  }

  approveRegistration(newUser: string, blockchainAddress: string, token: string): Observable<any> {
    const result = new ReplaySubject();
    this.httpInterceptorService.axiosInstance.post(SettingsService.APPROVE_BOLL_INSTITUTES, {blockchainAddress: newUser}, {
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': "application/json"
      }
    }).then(
      (response) => {
        result.next(response);
      }).catch((error) => {
      console.log(error);
      result.next(error);
    });
    return result;
  }
  uploadCredentials(data, blockchainAddress: string, token: string): Observable<any> {
    const result = new ReplaySubject();
    this.httpInterceptorService.axiosInstance.post(SettingsService.UPLOAD_CREDENTIALS_OTHERS, data, {
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': "application/json"
      }
    }).then(
      (response) => {
        result.next(response);
      }).catch((error) => {
      console.log(error);
      result.next(error);
    });
    return result;
  }

  updateInstituteInfo(data, blockchainAddress: string, token: string): Observable<any> {
    const result = new ReplaySubject();
    this.httpInterceptorService.axiosInstance.post(SettingsService.UPDATE_BOLL_INSTITUTE, data, {
      headers: {
        'Authorization': btoa(blockchainAddress + ':' + token),
        'Content-Type': "application/json"
      }
    }).then(
      (response) => {
        result.next(response);
      }).catch((error) => {
      console.log(error);
      result.next(error);
    });
    return result;
  }

}
