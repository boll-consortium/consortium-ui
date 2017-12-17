import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from "angular2-social-login";
import {SessionStateService} from "../../../services/global/session-state.service";
import {Router} from "@angular/router";
import {AuthServerService} from "../../../services/auth/auth-server.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public sessionStateService: SessionStateService,
              private _auth: AuthService, private _authServer: AuthServerService,
              private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('Error:::');
    if (this.sessionStateService.getUser() !== null) {
      this.sessionStateService.clearAll();
      console.log('Error:::A');
      this.router.navigateByUrl('/login');
    } else {
      console.log('Error:::Null');
      this.router.navigateByUrl('/login');
    }
  }

}
