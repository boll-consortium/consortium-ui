import { Injectable, OnInit } from '@angular/core';
import http from 'axios';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {SessionStateService} from "./global/session-state.service";

@Injectable()
export class DbService implements OnInit {
  ngOnInit(): void {
  }

  constructor(private sessionStateService: SessionStateService) { }

  getRegisteredNodes(): Observable<any> {
    const result = new ReplaySubject();
    http.get('/registrar/allNodes').then(response => {
      console.log(response);
      return result.next(response);
    });
    return result;
  }

  updateUserAccounts(accounts: string[]): Observable<any> {
    const result = new ReplaySubject(1);
    http.post('/users/addAccount/' + this.sessionStateService.getUser().uid, {
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
