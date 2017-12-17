import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';

import IndexContract from '../../contracts/Index.json';
import LearnerLearningProviderContract from '../../contracts/LearnerLearningProvider.json';
import RegistrarContract from '../../contracts/Registrar.json';
import {SessionStateService} from './services/global/session-state.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  public registrarOM: any;
  public registrar: any;
  public registrarAddress: string;
  title = 'Registrar';
  myEthAddress: string;
  public loggedIn: boolean;

  constructor(private route: Router, public sessionStateService: SessionStateService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    console.log(window.location.href);
    switch (window.location.pathname) {
      case '/':
        this.title = 'Learning Records';
        break;
      default :
        if (window.location.pathname.startsWith('/contracts')) {
          this.title = 'Index';
        }
    }
    this.loggedIn = this.sessionStateService.getUser() !== null;
  }

  ngAfterViewChecked(): void {
    this.loggedIn = this.sessionStateService.getUser() !== null;
    this.cd.detectChanges();
  }

  getRegisteredNodes() {
    // this.registrar
  }
}
