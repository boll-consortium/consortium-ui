import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SessionStateService} from "../../services/global/session-state.service";
import {ActivatedRoute, NavigationEnd, Router, RouterStateSnapshot} from "@angular/router";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {isNullOrUndefined} from "util";
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";


declare var jQuery: any;

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, AfterViewChecked {
  public loggedIn: boolean;
  private bollAddress: string;
  public user: any;
  public USER_TYPE = {LEARNER : 'LEARNER', PROVIDER : 'PROVIDER'};
  public ACTIVE_USER_TYPE = this.USER_TYPE.LEARNER;
  public activePage = 'schools';
  private snapshot: RouterStateSnapshot;
  public BASE_PATH = AuthCredentialsService.AUTH_SERVER_URL;

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
      this.bollAddress = this.user['accounts'][0];

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
        let currentURL = this.router.url.replace('/', '');
        console.log("about reomvin class", currentURL);
        if (!isNullOrUndefined(currentURL) && currentURL !== 'lti' && currentURL.length > 0) {
          const parent = this;
          if(currentURL.indexOf('school') !== -1) {
            currentURL = 'schools';
          }

          jQuery('document').ready(function () {
            jQuery('#' + parent.activePage + 'MenuLink').removeClass('active');
            console.log("remove class", parent.activePage);
            parent.activePage = currentURL;
            jQuery('#' + parent.activePage + 'MenuLink').addClass('active');
            console.log("added class", parent.activePage);
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

  downloadIDCard() {
    const parent = this;
    html2canvas(document.getElementById('bollIdCard')).then(function (canvas) {
      canvas.toBlob(blob => {
        saveAs(blob, 'boll_id_' + parent.bollAddress + '.png');
      });
    });
  }

}
