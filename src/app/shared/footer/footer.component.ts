import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";
declare var jQuery: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewChecked {

  constructor(public sessionStateService: SessionStateService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // this.resizeView();
  }

  ngAfterViewChecked(): void {
    // this.resizeView();
    this.cd.detectChanges();
  }

  resizeView(): void {
    if (this.sessionStateService.getUser() === null) {
      jQuery('.main-footer').css({'margin-left': 0});
    } else {
      jQuery('.main-footer').css({'margin-left': '230px'});
    }
  }

}
