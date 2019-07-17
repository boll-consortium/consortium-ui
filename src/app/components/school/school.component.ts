import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {isNullOrUndefined} from "util";
import {SessionStateService} from "../../services/global/session-state.service";
import {Observable} from "rxjs/Observable";
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit, AfterViewInit {
  public mainTitle = 'Schools';
  public subTitle = '';
  @Input()
  public schoolAddress: string;
  public currentView: string;
  public activeSubView: string;
  public school: any;
  public BASE_PATH = AuthCredentialsService.AUTH_SERVER_URL;

  constructor(private route: ActivatedRoute,
              private sessionStateService: SessionStateService) {
    this.activeSubView = 'scores';//'records';
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (!isNullOrUndefined(params['school_address'])) {
        this.schoolAddress = params['school_address'];
        this.school = this.sessionStateService.getSchool(this.schoolAddress);
        Observable.interval(30 * 1000).subscribe(() => {
          if (isNullOrUndefined(this.school)) {
            this.school = this.sessionStateService.getSchool(this.schoolAddress);
          }
        });
      }
      if (params['view'] !== null && params['view'] !== undefined) {
        console.log(this.currentView);
        this.currentView = params['view'];
        console.log(this.currentView);
      } else {
        console.log(this.route.snapshot.params['view']);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  setActiveSubView(viewName: string) {
    this.activeSubView = viewName;

    console.log("Sub view is:::", this.activeSubView);
  }

  getLastEvent() {
    return ('Last wrote records for you on: ' + this.school.lastEvent);
  }
}
