import {Component, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';

import IndexContract from '../../contracts/Index.json';
import LearnerLearningProviderContract from '../../contracts/LearnerLearningProvider.json';
import RegistrarContract from '../../contracts/Registrar.json';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public registrarOM: any;
  public registrar: any;
  public registrarAddress: string;
  title = 'Registrar';
  myEthAddress: string;

  constructor(private route: Router) {
  }

  ngOnInit(): void {
    console.log(window.location.href);
    switch (window.location.pathname) {
      case '/':
        this.title = 'Registrar';
        break;
      default :
        if (window.location.pathname.startsWith('/contracts')) {
          this.title = 'Index';
        }
    }
  }

  getRegisteredNodes() {
    // this.registrar
  }
}
