import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService, SessionStorage, SessionStorageService, SharedStorage} from "ngx-store";
import {isNullOrUndefined} from "util";

const recordTypeUniqueId = {};
const UniqueIdTorecordType = {};
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Abandoned"] = 0;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Activated"] = 1;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Attached"] = 2;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Bookmarked"] = 3;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedResolution"] = 4;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedSize"] = 5;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedSpeed"] = 6;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedVolume"] = 7;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Classified"] = 8;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ClosedPopout"] = 9;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Commented"] = 10;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Completed"] = 11;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Deactivated"] = 12;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Described"] = 13;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#DisabledClosedCaptioning"] = 14;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Disliked"] = 15;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#EnabledClosedCaptioning"] = 16;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Ended"] = 17;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#EnteredFullScreen"] = 18;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ExitedFullScreen"] = 19;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#ForwardedTo"] = 20;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Graded"] = 21;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Hid"] = 22;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Highlighted"] = 23;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Identified"] = 24;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#JumpedTo"] = 25;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Liked"] = 26;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Linked"] = 27;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#LoggedIn"] = 28;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#LoggedOut"] = 29;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Muted"] = 30;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#NavigatedTo"] = 31;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#OpenedPopout"] = 32;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Paused"] = 33;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Questioned"] = 34;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Ranked"] = 35;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Recommended"] = 36;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Replied"] = 37;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Restarted"] = 38;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Resumed"] = 39;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Reviewed"] = 40;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Rewound"] = 41;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Searched"] = 42;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Shared"] = 43;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Showed"] = 44;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Skipped"] = 45;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Started"] = 46;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Submitted"] = 47;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Subscribed"] = 48;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Tagged"] = 49;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#TimedOut"] = 50;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Unmuted"] = 51;
recordTypeUniqueId["http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed"] = 52;
recordTypeUniqueId["http://adlnet.gov/expapi/verbs/exited"] = 53;
recordTypeUniqueId["http://adlnet.gov/expapi/verbs/launched"] = 54;
recordTypeUniqueId["http://adlnet.gov/expapi/verbs/imported"] = 55;
recordTypeUniqueId["https://w3id.org/xapi/adb/verbs/searched"] = 56;
recordTypeUniqueId["https://w3id.org/xapi/adb/verbs/noted"] = 57;
recordTypeUniqueId["https://w3id.org/xapi/adb/verbs/highlighted"] = 58;
recordTypeUniqueId["https://w3id.org/xapi/adb/verbs/bookmarked"] = 59;
recordTypeUniqueId["https://w3id.org/xapi/adb/verbs/read"] = 60;

UniqueIdTorecordType[0] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Abandoned";
UniqueIdTorecordType[1] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Activated";
UniqueIdTorecordType[2] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Attached";
UniqueIdTorecordType[3] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Bookmarked";
UniqueIdTorecordType[4] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedResolution";
UniqueIdTorecordType[5] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedSize";
UniqueIdTorecordType[6] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedSpeed";
UniqueIdTorecordType[7] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ChangedVolume";
UniqueIdTorecordType[8] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Classified";
UniqueIdTorecordType[9] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ClosedPopout";
UniqueIdTorecordType[10] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Commented";
UniqueIdTorecordType[11] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Completed";
UniqueIdTorecordType[12] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Deactivated";
UniqueIdTorecordType[13] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Described";
UniqueIdTorecordType[14] = "http://purl.imsglobal.org/vocab/caliper/v1/action#DisabledClosedCaptioning";
UniqueIdTorecordType[15] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Disliked";
UniqueIdTorecordType[16] = "http://purl.imsglobal.org/vocab/caliper/v1/action#EnabledClosedCaptioning";
UniqueIdTorecordType[17] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Ended";
UniqueIdTorecordType[18] = "http://purl.imsglobal.org/vocab/caliper/v1/action#EnteredFullScreen";
UniqueIdTorecordType[19] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ExitedFullScreen";
UniqueIdTorecordType[20] = "http://purl.imsglobal.org/vocab/caliper/v1/action#ForwardedTo";
UniqueIdTorecordType[21] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Graded";
UniqueIdTorecordType[22] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Hid";
UniqueIdTorecordType[23] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Highlighted";
UniqueIdTorecordType[24] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Identified";
UniqueIdTorecordType[25] = "http://purl.imsglobal.org/vocab/caliper/v1/action#JumpedTo";
UniqueIdTorecordType[26] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Liked";
UniqueIdTorecordType[27] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Linked";
UniqueIdTorecordType[28] = "http://purl.imsglobal.org/vocab/caliper/v1/action#LoggedIn";
UniqueIdTorecordType[29] = "http://purl.imsglobal.org/vocab/caliper/v1/action#LoggedOut";
UniqueIdTorecordType[30] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Muted";
UniqueIdTorecordType[31] = "http://purl.imsglobal.org/vocab/caliper/v1/action#NavigatedTo";
UniqueIdTorecordType[32] = "http://purl.imsglobal.org/vocab/caliper/v1/action#OpenedPopout";
UniqueIdTorecordType[33] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Paused";
UniqueIdTorecordType[34] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Questioned";
UniqueIdTorecordType[35] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Ranked";
UniqueIdTorecordType[36] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Recommended";
UniqueIdTorecordType[37] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Replied";
UniqueIdTorecordType[38] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Restarted";
UniqueIdTorecordType[39] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Resumed";
UniqueIdTorecordType[40] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Reviewed";
UniqueIdTorecordType[41] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Rewound";
UniqueIdTorecordType[42] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Searched";
UniqueIdTorecordType[43] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Shared";
UniqueIdTorecordType[44] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Showed";
UniqueIdTorecordType[45] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Skipped";
UniqueIdTorecordType[46] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Started";
UniqueIdTorecordType[47] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Submitted";
UniqueIdTorecordType[48] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Subscribed";
UniqueIdTorecordType[49] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Tagged";
UniqueIdTorecordType[50] = "http://purl.imsglobal.org/vocab/caliper/v1/action#TimedOut";
UniqueIdTorecordType[51] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Unmuted";
UniqueIdTorecordType[52] = "http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed";

UniqueIdTorecordType[53] = "http://adlnet.gov/expapi/verbs/exited";
UniqueIdTorecordType[54] = "http://adlnet.gov/expapi/verbs/launched";
UniqueIdTorecordType[55] = "http://adlnet.gov/expapi/verbs/imported";
UniqueIdTorecordType[56] = "https://w3id.org/xapi/adb/verbs/searched";
UniqueIdTorecordType[57] = "https://w3id.org/xapi/adb/verbs/noted";
UniqueIdTorecordType[58] = "https://w3id.org/xapi/adb/verbs/highlighted";
UniqueIdTorecordType[59] = "https://w3id.org/xapi/adb/verbs/bookmarked";
UniqueIdTorecordType[60] = "https://w3id.org/xapi/adb/verbs/read";
@Injectable()
export class SessionStateService implements OnInit, OnDestroy {
  @SessionStorage()
  public user: any = this.getUser();
  @SharedStorage()
  public isLoggedIn: boolean = !!this.getUser();
  public platformName = "BOLL";
  public recordTypesToUniqueId = recordTypeUniqueId;
  public uniqueIdToRecordType = UniqueIdTorecordType;
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
        schools['blockchainAddress'] = school;
      }

      this.save('schools', schools);
    }
  }

  public addSchools(schools: any) {
    schools.forEach(school => {
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

}
