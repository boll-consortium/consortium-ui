import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

}
