import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../../services/global/session-state.service";
import {Router} from "@angular/router";
import {AuthServerService} from "../../../services/auth/auth-server.service";
import {isNullOrUndefined} from "util";
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  private user: any;

  constructor(public sessionStateService: SessionStateService,
              private _authServer: AuthServerService,
              private router: Router, private cd: ChangeDetectorRef, private meta: Meta) { }

  ngOnInit() {
    console.log('Error:::');
    if (this.meta.getTag('name= "uLoginToken"') !== null) {
      this.meta.removeTag('name= "uLoginToken"');
    }

    if (this.sessionStateService.getUser() !== null) {
      this.user = this.sessionStateService.getUser();
      this.sessionStateService.clearAll();
      const serverResponse = this._authServer.logout(this.user['accounts'][0], this.user['token'])._getNow();
      this.sessionStateService.clearAll();
      console.log('Error:::A', serverResponse);
      this.router.navigateByUrl('/login');
    } else {
      console.log('Error:::Null');
      this.router.navigateByUrl('/login');
    }
  }

}
