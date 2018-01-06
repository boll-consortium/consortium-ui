import { Injectable, OnInit } from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';

import IndexContract from '../../../../contracts/Index.json';
import LearnerLearningProviderContract from '../../../../contracts/LearnerLearningProvider.json';
import RegistrarContract from '../../../../contracts/Registrar.json';
import ProviderIndexContract from '../../../../contracts/ProviderIndex.json';
import UserIndexContract from '../../../../contracts/UserIndex.json';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class IndexContractService implements OnInit {
  userIndexContractOM: any;
  providerIndexContractOM: any;
  llpc: any;
  provider: any;
  accountType: string = "Learner";

  ngOnInit(): void {

  }

  constructor() {
    this.provider = new Web3.providers.HttpProvider('http://10.236.173.83:6060/node1');
    this.userIndexContractOM = contract(UserIndexContract);
    this.userIndexContractOM.setProvider(this.provider);
    this.providerIndexContractOM = contract(ProviderIndexContract);
    this.providerIndexContractOM.setProvider(this.provider);
    this.llpc = contract(LearnerLearningProviderContract);
    this.llpc.setProvider(this.provider);
  }

  getRecordsByLearningProvider(index_contract_address, learning_provider, start = 0, end = 10): Observable<any> {
    const result = new ReplaySubject();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.getLearningRecordsByProvider(learning_provider, start, end).then( response => {
        console.log(response);
        return result.next(response);
      }).catch(error => {
        console.log(error);
        result.error(error);
      });
    }).catch(error => {
      console.log(error);
      result.error(error);
    });
    return result;
  }

  getRecordsByType(index_contract_address, learning_provider, recordType, start = 0, end = 10): Observable<any> {
    const result = new ReplaySubject();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.getLearningRecordsByRecordType(learning_provider, start, end, recordType).then( response => {
        console.log(response);
        return result.next(response);
      }).catch(error => {
        console.log(error);
        result.error(error);
      });
    }).catch(error => {
      console.log(error);
      result.error(error);
    });
    return result;
  }

  getRecordsByProvidersAndRecordType(index_contract_address, learning_providers, recordType, start = 0, end = 10): Observable<any> {
    const result = new ReplaySubject();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.getLearningRecordsByRecordTypeAndProviders(learning_providers, start, end, recordType).then( response => {
        console.log(response);
        return result.next(response);
      }).catch(error => {
        console.log(error);
        result.error(error);
      });
    }).catch(error => {
      console.log(error);
      result.error(error);
    });
    return result;
  }

  getMyLearningProviders(index_contract_address, owner_address): Observable<any> {
    const result = new ReplaySubject();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    this.llpc.at("0xa108e693191db19e6d8e5055fa98107bfcc69145").then( cotrct => {
      cotrct.getOwner().then(res => {
        console.log("Owner:::", res);
        result.next(res);
      });
      cotrct.getRecordType().then(res => {
        console.log("ReType:::", res);
        result.next(res);
      });
    });
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.getLearningProviders().then( response => {
        console.log(response);
        return result.next(response);
      }).catch(error => {
        console.log(error);
        result.error(error);
      });
      indexContract.getLearningRecordsByProvider("0xe715f10de7cfcca2eb155ef87eea8c832bffcd78", 0, 4).then( response => {
        console.log("2222222", response);
      }).catch(error => {
        console.log("22222eee:", error);
      });
    }).catch(error => {
      console.log(error);
      result.error(error);
    });
    return result;
  }

}
