import { Component, OnInit } from '@angular/core';
import {AuthServerService} from "../../services/auth/auth-server.service";
import {SessionStateService} from "../../services/global/session-state.service";
import {isNullOrUndefined} from "util";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-activity-logger',
  templateUrl: './activity-logger.component.html',
  styleUrls: ['./activity-logger.component.css']
})
export class ActivityLoggerComponent implements OnInit {

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
  constructor(private authService: AuthServerService,
              private sessionStateService: SessionStateService,
              private registrarService: RegistrarContractService) { }

  ngOnInit() {
    console.log("Initializing activities");
    this.eventHolder = this.sessionStateService.get('eventsStore');
    this.user = this.sessionStateService.getUser();
    this.activeRC = this.registrarService.registrarAddress;
    if (isNullOrUndefined(this.eventHolder) || (new Date().getTime() - this.eventHolder.timestamp) > 60000 ) {
      this.authService.getLogs(null).subscribe(response => {
        console.log("Activities ::: ", response);
        if (response['data']['code'] === 200) {
          this.sessionStateService.save('eventsStore', {
            events: response['data']['events'],
            timestamp: new Date().getTime()
          });
          this.eventHolder = this.sessionStateService.get('eventsStore');
        }
      });
    } else {
      console.log("Events are", this.eventHolder);
    }
    Observable.interval(2 * 60 * 1000).subscribe(() => {
      this.authService.getLogs(null).subscribe(response => {
        if (response['data']['code'] === 200) {
          this.sessionStateService.save('eventsStore', {
            events: response['data']['events'],
            timestamp: new Date().getTime()
          });
          this.eventHolder = this.sessionStateService.get('eventsStore');
        }
      });
    });
  }

}
