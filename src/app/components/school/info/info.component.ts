import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  @Input()
  public selectedSchoolAddress: string;
  public showLoader = false;

  constructor() {
  }

  ngOnInit() {
  }

}
