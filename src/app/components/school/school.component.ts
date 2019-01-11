import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {isNullOrUndefined} from "util";

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

  constructor(private route: ActivatedRoute) {
    this.activeSubView = 'records';
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (!isNullOrUndefined(params['school_address'])) {
        this.schoolAddress = params['school_address'];
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
  }

}
