import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {LocalStorage, SessionStorage, SessionStorageService, LocalStorageService, SharedStorage} from "ngx-store";

@Injectable()
export class SessionStateService implements OnInit, OnDestroy {
  @SessionStorage()
  public user: any = this.getUser();
  @SharedStorage()
  public isLoggedIn: boolean = !!this.getUser();
  public platformName = "Personal LAB";
  constructor(private localStorageService: LocalStorageService,
              private sessionStorageService: SessionStorageService) { }
  ngOnInit(): void {
    this.user = this.getUser();
    console.log(this.user);
    this.isLoggedIn = !!this.user;
  }
  ngOnDestroy(): void {
  }

  public saveSomeData(object: Object, array: Array<any>) {
  }
  public save(key: string, object: Object) {
    this.sessionStorageService.set(key, object);
  }

  public clearSomeData(): void {
    this.localStorageService.clear('decorators'); // removes only variables created by decorating functions
    this.localStorageService.clear('prefix'); // removes variables starting with set prefix (including decorators)
    this.sessionStorageService.clear('all'); // removes all session storage data
  }
  public clearAll(): void {
    this.sessionStorageService.set('user', null);
    this.localStorageService.clear('all');
    this.sessionStorageService.clear('all'); // removes all session storage data
  }
  public get(key) {
    return this.sessionStorageService.get(key);
  }

  public getUser() {
    return this.sessionStorageService.get('user');
  }
}
