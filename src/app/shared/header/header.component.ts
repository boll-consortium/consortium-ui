import {AfterViewChecked, ChangeDetectorRef, Component, OnChanges, OnInit} from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {SessionStateService} from "../../services/global/session-state.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewChecked {
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
