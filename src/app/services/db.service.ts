import { Injectable } from '@angular/core';
import http from 'axios';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class DbService {

  constructor() { }

  getRegisteredNodes(): Observable<any> {
    const result = new ReplaySubject();
    http.get('/registrar/allNodes').then(response => {
      console.log(response);
      return result.next(response);
    });
    return result;
  }

}
