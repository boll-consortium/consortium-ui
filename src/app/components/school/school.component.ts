import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {isNullOrUndefined} from "util";
import {SessionStateService} from "../../services/global/session-state.service";
import {Observable} from "rxjs/Observable";
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";
import {AuthServerService} from "../../services/auth/auth-server.service";

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
  public selectedStudent: string;
  public currentView: string;
  public activeSubView: string;
  public showStudentRecords = false;
  public school: any;
  public BASE_PATH = AuthCredentialsService.AUTH_SERVER_URL;
  keyword = 'name';
  usersListDB = {};
  usersList = [{id: 1, name: 'Patrick'}];
  public myCourses = [];
  public selectedCourse = "";
  public showStudentSearchLoader = false;
  public user;
  selectedStudentAddress: any;
  selectedStudentName: any;
  studentSchools: any;

  constructor(private route: ActivatedRoute,
              private sessionStateService: SessionStateService,
              private authService: AuthServerService) {
    this.activeSubView = 'scores';//'records';
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.user = this.sessionStateService.getUser();
      if (!isNullOrUndefined(params['school_address'])) {
        this.schoolAddress = params['school_address'];
        this.loadCourses();
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

  selectEvent(item) {
    // do something with selected item
    this.showStudentSearchLoader = true;
    this.selectedStudentName = item.name;
    this.authService.getStudentAddress(this.user['accounts'][0], this.user['token'], this.schoolAddress, item.id).subscribe(result => {
      this.selectedStudentAddress = result['data']['blockchainAddress'];
      this.loadMySchools(item.id, this.selectedStudentAddress);
    });
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }

  searchStudent() {
    this.showStudentSearchLoader = true;
  }

  onCourseChange(event) {
    const courseId = event.target.value;
    if (this.usersListDB[courseId] === undefined) {
      this.showStudentSearchLoader = true;
      this.authService.getMyStudents(this.user['accounts'][0], this.user['token'], this.schoolAddress, courseId).subscribe(result => {
        this.usersListDB[courseId] = [];
        const users = result['data'];
        for (let i = 0; i < users.length; i++) {
          this.usersListDB[courseId].push({id: users[i]['id'], name: users[i]['fullname']});
        }
        this.usersList = this.usersListDB[courseId];
        this.showStudentSearchLoader = false;
      });
    } else {
      this.usersList = this.usersListDB[courseId];
    }
  }

  loadCourses() {
    this.showStudentSearchLoader = true;
    this.authService.getMyCourses(this.user['accounts'][0], this.user['token'], this.schoolAddress).subscribe( result => {
      const courses = result['data'];
      for (let i = 0; i < courses.length; i++) {
        this.myCourses.push({id: courses[i]['id'], name: courses[i]['fullname']});
      }
      this.showStudentSearchLoader = true;
    });
  }

  loadMySchools(userId, userBlockchainAddress) {
    this.showStudentSearchLoader = true;
    this.authService.getMySchools(this.user['accounts'][0], this.user['token'], userId, userBlockchainAddress).subscribe(result => {
      this.studentSchools = result['data']['schools'];
    });
  }
}
