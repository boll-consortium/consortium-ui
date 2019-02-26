import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";
import {ActivatedRoute, NavigationEnd, Router, RouterStateSnapshot} from "@angular/router";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {isNullOrUndefined} from "util";


declare var jQuery: any;

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, AfterViewChecked {
  public loggedIn: boolean;
  public user: any;
  public USER_TYPE = {LEARNER : 'LEARNER', PROVIDER : 'PROVIDER'};
  public ACTIVE_USER_TYPE = this.USER_TYPE.LEARNER;
  public activePage = 'schools';
  private snapshot: RouterStateSnapshot;

  constructor(public sessionStateService: SessionStateService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private registrarService: RegistrarContractService) {
    this.snapshot = router.routerState.snapshot;
  }

  ngOnInit() {
    this.user = this.sessionStateService.getUser();
    this.loggedIn = this.user !== null;
    if (this.loggedIn) {
      this.registrarService.isLearningProvider(this.user['accounts'][0]).subscribe(response => {
        console.log("User is provider", response, this.user['accounts'][0]);
        if (response) {
          this.ACTIVE_USER_TYPE = this.USER_TYPE.PROVIDER;
        }
      });
    }
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        // current URL
        this.activePage = this.router.url.replace('/', '');
        console.log("about reomvin class");
        if (!isNullOrUndefined(this.activePage)) {
          this.activePage = this.activePage.indexOf('school') !== -1 ? 'schools' : this.activePage;
          console.log("removing class");
          jQuery('document').ready(function () {
            jQuery('#' + this.activePage + 'MenuLink').removeClass('active');
            console.log("remove class");
          });
        }
      }
    });
  }
  ngAfterViewChecked() {
    this.loggedIn = this.sessionStateService.getUser() !== null;
    this.cdRef.detectChanges();
  }

  navigateTo(view) {
    console.log(view);
    this.router.navigate(['/home/' + view]);
  }

  isAdminUser(): boolean {
    if (isNullOrUndefined(this.user)) {
      this.user = this.sessionStateService.getUser();
    }
    return !isNullOrUndefined(this.user) && this.user.isAdmin;
  }

}
