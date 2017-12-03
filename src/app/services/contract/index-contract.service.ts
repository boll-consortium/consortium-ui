import { Injectable, OnInit } from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';

import IndexContract from '../../../../contracts/Index.json';
import LearnerLearningProviderContract from '../../../../contracts/LearnerLearningProvider.json';
import RegistrarContract from '../../../../contracts/Registrar.json';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class IndexContractService implements OnInit {
  indexContractOM: any;
  indexContract: any;
  provider: any;

  ngOnInit(): void {

  }

  constructor() {
    this.provider = new Web3.providers.HttpProvider('http://10.236.173.83:6060/node1');
    this.indexContractOM = contract(IndexContract);
    this.indexContractOM.setProvider(this.provider);
  }

  getAllAccessibleData(index_contract_address, owner_address): Observable<any> {
    const result = new ReplaySubject();
    this.indexContractOM.at(index_contract_address).then( indexContract => {
      indexContract.getAccessibleLearningRecordsAddress(owner_address).then( response => {
        console.log(response);
        return result.next(response);
      });
      indexContract.checkIsLearningProvider().then( response => {
        console.log('DDHDHDHDH:::::::', response);
      });
    });
    return result;
  }

}
