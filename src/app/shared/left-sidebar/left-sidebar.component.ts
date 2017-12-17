import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, AfterViewChecked {
  public loggedIn: boolean;
  constructor(public sessionStateService: SessionStateService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loggedIn = this.sessionStateService.getUser() !== null;
  }
  ngAfterViewChecked() {
    this.loggedIn = this.sessionStateService.getUser() !== null;
    this.cdRef.detectChanges();
  }

}
