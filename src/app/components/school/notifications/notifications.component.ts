import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input()
  public selectedSchoolAddress: string;
  @Input()
  public selectedStudentAddress: string;

  constructor() { }

  ngOnInit() {
  }

}
