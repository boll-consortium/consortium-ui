import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-inner-header',
  templateUrl: './inner-header.component.html',
  styleUrls: ['./inner-header.component.css']
})
export class InnerHeaderComponent implements OnInit {
   @Input()
   mainTitle = "Schools";
   @Input()
   subTitle = "My Schools";
  public schoolBollAddress: string;

  constructor() { }

  ngOnInit() {
  }

}
