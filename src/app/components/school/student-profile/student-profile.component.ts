import {Component, Input, OnInit} from '@angular/core';
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
  public mySchools = [];
  public selectedSchool = null;
  constructor() { }

  ngOnInit() {
  }

  loadStudentData() {
    if (!isNullOrUndefined(this.selectedSchool) && this.selectedSchool.trim() !== '') {
      console.log('Selected school is ', this.selectedSchool);
    }
  }
}
