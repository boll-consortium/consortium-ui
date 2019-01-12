import {Component, OnInit} from '@angular/core';
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
  public eventTexts = {};
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
      this.authService.getLogs(this.user['accounts'][0], this.user['token']).subscribe(response => {
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
      this.authService.getLogs(this.user['accounts'][0], this.user['token']).subscribe(response => {
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

  getEventText(event: any, index: number) {
    let eventText = this.eventTexts[index];
    if (!isNullOrUndefined(eventText)) {
      return eventText;
    }
    if (this.actionNames.RC === event.actionName && this.activeRC === event.affectedContractAddress) {
      eventText = ("<p>You initiated BOLL <span class=\"text-bold\">" + event.senderAddress + "</span></p>");
    }
    if (this.actionNames.PIC === event.actionName) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You created an index contract for <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span></p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>An index contract was created for you by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.UIC === event.actionName) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You created an index contract for <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span></p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>An index contract was created for you by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.LLPC === event.actionName) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You created an index contract for <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span></p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>An index contract was created for you by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.APPROVE_INSTITUTE === event.actionName && this.activeRC === event.affectedContractAddress) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You approved <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span> to join BOLL</p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>Your request to Join BOLL was approved by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.REGISTER === event.actionName && this.activeRC === event.affectedContractAddress) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You registered <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span> on BOLL</p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>Your BOLL registration was completed by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.PAIR_USER_WITH_BOLL_ADDRESS === event.actionName && this.activeRC === event.affectedContractAddress) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You paired <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span> to their user ID</p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>Your BOLL account was paired to <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.ASSIGN_INDEX_CONTRACT === event.actionName && this.activeRC === event.affectedContractAddress) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You assigned an Index Contract to <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span> on BOLL</p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>An Index Contract has been assigned to you by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    if (this.actionNames.INSERT_LEARNING_RECORD === event.actionName) {
      if (event.senderAddress === this.user['accounts'][0]) {
        eventText = ("<p>You created a new learning log for  <span class=\"text-bold\">" +
          (event.participantName === undefined ? event.participantAddress : event.participantName) + "</span></p>");
      }
      if (event.participantAddress === this.user['accounts'][0]) {
        eventText = ("<p>A new learning log was created for you by <span class=\"text-bold\">" +
          (event.senderName === undefined ? event.senderAddress : event.senderName) + "</span></p>");
      }
    }
    this.eventTexts[index] = eventText;
    return eventText;
  }
}
