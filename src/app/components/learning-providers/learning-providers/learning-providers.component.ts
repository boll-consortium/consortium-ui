import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../../services/global/session-state.service";
import {Router} from "@angular/router";
import {AuthServerService} from "../../../services/auth/auth-server.service";

@Component({
  selector: 'app-learning-providers',
  templateUrl: './learning-providers.component.html',
  styleUrls: ['./learning-providers.component.css']
})
export class LearningProvidersComponent implements OnInit, AfterViewChecked {

  public user: any;

  constructor(public sessionStateService: SessionStateService,
              private _authServer: AuthServerService,
              private router: Router,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.refreshUser();
  }

  ngAfterViewChecked(): void {
    this.refreshUser();
    this.cd.detectChanges();
  }

  refreshUser(): void {
    this.user = this.sessionStateService.getUser();
  }
}
