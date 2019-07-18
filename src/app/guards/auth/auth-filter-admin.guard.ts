import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionStateService} from "../../services/global/session-state.service";
import {isNullOrUndefined} from "util";

@Injectable({
  providedIn: 'root'
})
export class AuthFilterAdminGuard implements CanActivate  {

  constructor(private sessionStateService: SessionStateService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("I got in!!!");
    if (!isNullOrUndefined(this.sessionStateService.getUser()) && this.sessionStateService.getUser().isAdmin) {
      console.log(this.sessionStateService.getUser(), this.sessionStateService.isLoggedIn);
      console.log("Admin User");
      return true;
    }
    console.log("I got hereeeeeeee");
    this.router.navigate(['/home']);
    return false;
  }

}

