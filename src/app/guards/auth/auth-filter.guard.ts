import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {SessionStateService} from "../../services/global/session-state.service";

@Injectable()
export class AuthFilterGuard implements CanActivate {

  constructor(private sessionStateService: SessionStateService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("I got in!!!");
    if (this.sessionStateService.isLoggedIn || this.sessionStateService.getUser() !== null) {
      console.log(this.sessionStateService.getUser(), this.sessionStateService.isLoggedIn);
      console.log("I stopped here!!!");
      return true;
    }
    console.log("I got hereeeeeeee");
    this.router.navigate(['/login']);
    return false;
  }
}
