import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {AuthCredentialsService} from "../auth/auth-credentials/auth-credentials.service";
import axios from "axios";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SettingsService {

  constructor() { }

  public static SERVER_URL = '/';
  public static GET_BOLL_INSTITUTES = SettingsService.SERVER_URL + 'sb/identity/institutes';
  public static APPROVE_BOLL_INSTITUTES = SettingsService.SERVER_URL + 'sb/identity/create/approve_institute';
  private HEADERS = {
      'Authorization': btoa("0xff5d3172002a997c77e67ce0cbd8feaafdf66cda:accessToken"),
      'Content-Type': "application/json"
    };

  public getAllInstitutes(bollAddress: string, token: string) {
    const observer = new ReplaySubject(2);
    axios.get(SettingsService.GET_BOLL_INSTITUTES, {
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
    axios.post(SettingsService.APPROVE_BOLL_INSTITUTES, {blockchainAddress: newUser}, {
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