import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {isNullOrUndefined} from "util";
import {SessionStateService} from "../../services/global/session-state.service";
import {Observable} from "rxjs/Observable";
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";
import {AuthServerService} from "../../services/auth/auth-server.service";
import {DbService} from "../../services/db.service";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";

declare var $: any;
declare function sliderInit(element_id): any;

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
  public selectedSchool: string;
  public currentView: string;
  public activeSubView: string;
  public showStudentRecords = false;
  public school: any;
  public BASE_PATH = AuthCredentialsService.AUTH_SERVER_URL;
  keyword = 'name';
  usersListDB = {};
  usersList = [{id: 1, name: 'Patrick'}];
  public myCourses = [];
  public studentsCourses = {};
  public selectedCourse = "";
  public showStudentSearchLoader = false;
  public user;
  selectedStudentAddress: any;
  selectedStudentName: any;
  studentSchools: any;
  indexContractAddress: any;
  private counter: number;
  buttonTexts = {
    'warning': 'PENDING',
    'success': 'REQUEST',
    'danger': 'DENIED',
    'green': 'GRANTED'
  };

  constructor(private route: ActivatedRoute,
              private sessionStateService: SessionStateService,
              private authService: AuthServerService,
              private dbService: DbService,
              private indexService: IndexContractService,
              private registrarService: RegistrarContractService) {
    this.activeSubView = 'scores'; //'records';
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.user = this.sessionStateService.getUser();
      if (!isNullOrUndefined(params['school_address'])) {
        this.schoolAddress = params['school_address'];
        this.registrarService.getIndexContract(this.schoolAddress).subscribe((address) => {
          this.indexContractAddress = address;
        });
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
    this.selectedStudentName = item.name;
    this.selectedStudentAddress = item.blockchainAddress;
    this.studentSchools = item.mySchools;

    console.log("select triggered", item);
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
      this.authService.getMyStudents(this.user['accounts'][0], this.user['token'],
        this.schoolAddress, courseId).subscribe(result => {
        this.usersListDB[courseId] = [];
        const users = result['data'];
        for (let i = 0; i < users.length; i++) {
          const schools = [];
          if (!isNullOrUndefined(users[i]['mySchools'])) {
            for (let j = 0; j < users[i]['mySchools'].length; j++) {
              schools.push(JSON.parse(users[i]['mySchools']));
            }
          }
          this.usersListDB[courseId].push({id: users[i]['id'], name: users[i]['fullname'],
            mySchools: schools, blockchainAddress: users[i]['blockchainAddress']});
        }
        this.usersList = this.usersListDB[courseId];
        this.getPermissions();
      });
    } else {
      this.usersList = this.usersListDB[courseId];
    }
  }

  getPermissions() {
    this.counter = 0;
    this.usersList.forEach((user, index) => {
      if (!isNullOrUndefined(user['blockchainAddress']) && user['blockchainAddress'] !== '') {
        this.indexService.getLearningRecordsByLearner(this.indexContractAddress,
          user['blockchainAddress']).subscribe(records => {
            console.log('records', records);
          user['class'] = 'success';
          user['permission'] = false;
          user['llpc_permitted'] = [];
          user['llpc_pending'] = [];
          user['records'] = [];
          this.usersList[index] = user;

          if (records === undefined || records.length === 0) {
            if (this.counter >= this.usersList.length) {
              this.showStudentSearchLoader = false;
            }
          } else {
            this.getTeachersPermissions(records, user, index);
          }
        });
      }

      this.counter++;
    });
  }

  getTeachersPermissions(records, user, index) {
    user['llpc_permitted'] = [];
    user['llpc_pending'] = [];
    user['records'] = records;
    const awaitingPending = {};
    const awaitingPermitted = {};
    console.log("user ", user, "index ", index);
    for (let i = 0; i < records.length; i++) {
      Observable.forkJoin(this.indexService.getPermissionsOnly({contractAddress: records[i]},
        this.user['accounts'][0], false), this.indexService.getPermissionsOnly(
          {contractAddress: records[i]}, this.user['accounts'][0], true))
        .subscribe((results: any) => {
          const result1 = results[0];
          console.log("Result 1 ", result1);

          if (result1 !== undefined && result1.length > 0) {
            for (let j = 0; j < result1.length; j++) {
              if (result1[j].status.indexOf('Read') !== -1) {
                user['llpc_permitted'].push(records[i]);
                user['class'] = 'green';
              } else {
                awaitingPermitted[records[i]] = true;
              }
            }
          }

          const result2 = results[1];
          console.log("Result 2 ", result2);

          if (result2 !== undefined && result2.length > 0) {
            for (let j = 0; j < result2.length; j++) {
              if (result2[j].status.indexOf('Read') !== -1) {
                user['llpc_pending'].push(records[i]);
                if (user['class'] !== undefined && user['class'] !== '') {
                  user['class'] = 'warning';
                }
              } else {
                awaitingPending[records[i]] = true;
              }
            }
          }
          this.usersList[index] = user;

          if (this.counter >= this.usersList.length) {
            this.showStudentSearchLoader = false;
          }

          console.log('users list:', index, this.usersList);
          this.counter++;
      });
    }
  }

  loadCourses() {
    this.showStudentSearchLoader = true;
    this.authService.getMyCourses(this.user['accounts'][0], this.user['token'],
      this.schoolAddress).subscribe( result => {
      const courses = result['data'];
      console.log('courses are ' + courses);
      for (let i = 0; i < courses.length; i++) {
        this.myCourses.push({id: courses[i]['id'], name: courses[i]['fullname']});
      }
      this.showStudentSearchLoader = false;
    });
  }

  loadMySchools(userId, userBlockchainAddress) {
    this.showStudentSearchLoader = true;
    this.authService.getMySchools(this.user['accounts'][0], this.user['token'], userId,
      userBlockchainAddress).subscribe(result => {
      this.studentSchools = result['data']['schools'];
    });
  }

  loadRecordsForUser($event: any) {
    this.showStudentSearchLoader = true;
    this.showStudentRecords = true;
    this.selectedSchool = $event.school.blockchainAddress;
    console.log("Records sumbitted", $event);
    this.showStudentSearchLoader = false;

    this.dbService.getStudentCoursesFromSchool(this.user['accounts'][0], this.user['token'],
      $event.school.blockchainAddress, this.selectedStudent).subscribe((response) => {
        console.log("Student course lists are ::: ", response);
        this.studentsCourses[$event.school.blockchainAddress] = response.data;

        $('#courses_carousel').carousel({
          interval: false,
        });
        sliderInit('courses_carousel');
        $('.carousel').bcSwipe({ threshold: 50 });
        this.showStudentSearchLoader = false;
    });
  }

  selectView(showMyRecords: boolean) {
    this.showStudentRecords = showMyRecords;
  }

  permissionHandler(item, event) {
    console.log('let look at the action;');
    event.stopPropagation();
    return false;
  }
}
