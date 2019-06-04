import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService, SessionStorage, SessionStorageService, SharedStorage} from "ngx-store";
import {isNullOrUndefined} from "util";
import StatementSpecs from "../../../record_type.json";

@Injectable()
export class SessionStateService implements OnInit, OnDestroy {
  @SessionStorage()
  public user: any = this.getUser();
  @SharedStorage()
  public isLoggedIn: boolean = !!this.getUser();
  public platformName = "BOLL";
  public isdemoRun = false;
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
    const user = this.sessionStorageService.get('user');
    if (this.isdemoRun) {
      return {
        accounts: ["0xff5d3172002a997c77e67ce0cbd8feaafdf66cda"],
        "active" : true,
        "isAdmin" : true};
    }
    return user;
  }

  public getSchools() {
    return this.sessionStorageService.get('schools');
  }

  public getSchool(schoolAddress: string) {
    const schools = this.getSchools();
    if (!isNullOrUndefined(schools) && !isNullOrUndefined(schoolAddress)) {
      return schools[schoolAddress];
    }
    return null;
  }

  public addSchool(school: any) {
    let schools = this.getSchools();

    if (!isNullOrUndefined(school)) {
      if (!isNullOrUndefined(schools)) {
        schools[school['blockchainAddress']] = school;
      } else {
        schools = {};
        schools[school['blockchainAddress']] = school;
      }

      this.save('schools', schools);
    }
  }

  public addSchools(schools: any) {
    schools.forEach((school, index) => {
      this.addSchool(school);
    });
  }

  public fromAscii(str) {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      const n = code.toString(16);
      hex += n.length < 2 ? '0' + n : n;
    }
    return hex;
  }

   public toAscii(hex) {
// Find termination
    let str = "";
    let i = 0;
    const l = hex.length;
    if (hex.substring(0, 2) === '0x') {
      i = 2;
    }
    for (; i < l; i += 2) {
      const code = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(code);
    }

    return str;
  }

  public recordsToUniqueId(recordType: string): number {
    let recordId = -1;
    StatementSpecs.some((statementSpec) => {
      const index = statementSpec.actions.findIndex((action) => {
        return action.value === recordType;
      });
      if (index > 0) {
        recordId = (statementSpec.starting_index + index);
        return true;
      }
      return false;
    });

    return recordId > -1 ? recordId : null;
  }

}
