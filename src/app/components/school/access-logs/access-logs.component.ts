import {Component, Input, OnInit} from '@angular/core';
import {AuthServerService} from "../../../services/auth/auth-server.service";
import {SessionStateService} from "../../../services/global/session-state.service";
import {RegistrarContractService} from "../../../services/contract/registrar-contract.service";
import {isNullOrUndefined} from "util";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-access-logs',
  templateUrl: './access-logs.component.html',
  styleUrls: ['./access-logs.component.css']
})
export class AccessLogsComponent implements OnInit {

  public eventHolder: any;
  public user: any;
  public activeRC: string;
  public actionNames = {
    RC: "RC",
    PIC: "PIC",
    UIC: "UIC",
    LLPC: "LLPC",
    REGISTER: "register",
    UNREGISTER: "unregistered",
    APPROVE_INSTITUTE: "approveInstitute",
    INSERT_LEARNING_RECORD: "insertLearningRecord",
    GRANT_ACCESS: "grantAccess",
    REQUEST_ACCESS: "requestAccess",
    PAIR_USER_WITH_BOLL_ADDRESS: "pairUserIdWithBOLLAddress",
    ASSIGN_INDEX_CONTRACT: "assignIndexContract"
  };
  @Input()
  public selectedSchoolAddress: string;

  constructor(private authService: AuthServerService,
              private sessionStateService: SessionStateService,
              private registrarService: RegistrarContractService) {
  }

  ngOnInit() {
    console.log("Initializing activities");
    this.eventHolder = this.sessionStateService.get('eventsStore:' + this.selectedSchoolAddress);
    this.user = this.sessionStateService.getUser();
    this.activeRC = this.registrarService.registrarAddress;
    if (isNullOrUndefined(this.eventHolder) || (new Date().getTime() - this.eventHolder.timestamp) > 60000) {
      this.authService.getLogsBySchool(this.user['accounts'][0], this.user['token'], this.selectedSchoolAddress).subscribe(response => {
        console.log("Activities by school ::: ", response);
        if (response['data']['code'] === 200) {
          this.sessionStateService.save('eventsStore:' + this.selectedSchoolAddress, {
            events: response['data']['events'],
            timestamp: new Date().getTime()
          });
          this.eventHolder = this.sessionStateService.get('eventsStore:' + this.selectedSchoolAddress);
        }
      });
    } else {
      console.log("Events by school are", this.eventHolder);
    }
    Observable.interval(2 * 60 * 1000).subscribe(() => {
      this.authService.getLogsBySchool(this.user['accounts'][0], this.user['token'], this.selectedSchoolAddress).subscribe(response => {
        if (response['data']['code'] === 200) {
          this.sessionStateService.save('eventsStore:' + this.selectedSchoolAddress, {
            events: response['data']['events'],
            timestamp: new Date().getTime()
          });
          this.eventHolder = this.sessionStateService.get('eventsStore:' + this.selectedSchoolAddress);
        }
      });
    });
  }

}
