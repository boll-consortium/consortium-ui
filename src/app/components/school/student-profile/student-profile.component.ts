import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  @Input()
  public selectedStudentAddress: string;
  @Input()
  public selectedStudentName: string;
  @Input()
  public mySchools = [];
  @Output()
  userSelected = new EventEmitter();
  public selectedSchool = null;
  constructor() { }

  ngOnInit() {
  }

  loadStudentData() {
    if (!isNullOrUndefined(this.selectedSchool) && this.selectedSchool.trim() !== '') {
      console.log('Selected school is ', this.selectedSchool);
      this.userSelected.emit({'school': this.selectedSchool, 'studentAddress':
        this.selectedStudentAddress, 'studentName': this.selectedStudentName});
    }
  }
}
