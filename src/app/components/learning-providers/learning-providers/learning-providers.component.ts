import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "angular2-social-login";
import {SessionStateService} from "../../../services/global/session-state.service";
import {Router} from "@angular/router";
import {AuthServerService} from "../../../services/auth/auth-server.service";
import {EthCommunicationService} from "../../../services/contract/eth-communication.service";

@Component({
  selector: 'app-learning-providers',
  templateUrl: './learning-providers.component.html',
  styleUrls: ['./learning-providers.component.css']
})
export class LearningProvidersComponent implements OnInit, AfterViewChecked {

  public user: any;

  constructor(public sessionStateService: SessionStateService,
              private _auth: AuthService, private _authServer: AuthServerService,
              private router: Router,
              private cd: ChangeDetectorRef,
              private ethCommunicationService: EthCommunicationService) {
  }

  ngOnInit() {
    this.refreshUser();
    this.ethCommunicationService.init(null, null, null);
  }

  ngAfterViewChecked(): void {
    this.refreshUser();
    this.cd.detectChanges();
  }

  refreshUser(): void {
    this.user = this.sessionStateService.getUser();
  }
}
