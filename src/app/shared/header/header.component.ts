import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  public loggedIn: boolean;
  private bollAddress: string;
  constructor(public sessionStateService: SessionStateService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loggedIn = this.sessionStateService.getUser() !== null;

    if (this.loggedIn) {
      this.bollAddress = this.sessionStateService.getUser()['accounts'][0];
    }
  }

  ngAfterViewChecked() {
    this.loggedIn = this.sessionStateService.getUser() !== null;

    if (this.loggedIn) {
      this.bollAddress = this.sessionStateService.getUser()['accounts'][0];
    }

    this.cdRef.detectChanges();
  }


  downloadIDCard() {
    html2canvas(document.getElementById('bollIdCard')).then(function (canvas) {
      canvas.toBlob(blob => {
        saveAs(blob, 'boll_id_' + this.bollAddress + '.png');
      });
    });
  }


}
