import {Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import {SessionStateService} from "../../../services/global/session-state.service";
declare var jQuery: any;
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private defaultMargin = "230px";
  constructor(public sessionStateService: SessionStateService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.resizeView();
}

ngAfterViewChecked(): void {
    this.resizeView();
    this.cd.detectChanges();
}

resizeView(): void {
  if (this.sessionStateService.getUser() && window.screen.width > 900) {
    jQuery('.content-wrapper').css({'margin-left': this.defaultMargin});
  }else {
    jQuery('.content-wrapper').css({'margin-left': 0});
  }
}

}
