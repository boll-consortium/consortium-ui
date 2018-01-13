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
    console.log("SSSSSSSSSSSSSSS1");
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.getLearningRecordsByProvider(learning_provider).then( response => {
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
    console.log("SSSSSSSSSSSSSSS2");
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
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.getProviders().then( response => {
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

  insertRecordTest(index_contract_address, owner_address): Observable<any> {
    const result = new ReplaySubject();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then( indexContract => {
      indexContract.insertLearningRecord("0xa56ca4611087653cc6be31faa0911df2dfe951ec",
        "0x83493f1779d3e1adc53ed7c4e84ff70c7be332b9",
        "http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed",
        {
          from: '0xa56ca4611087653cc6be31faa0911df2dfe951ec',
          gas: 4700000
        }).then( response => {
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

  createRecordTest(): Observable<any> {
    const result = new ReplaySubject();
    this.llpc.new("0x8b9b4d62a767e0902d78dd6cbc1753e62103519a",
      "0x8b9b4d62a767e0902d78dd6cbc1753e62103519a",
      "http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed",
      {
        from: '0xa56ca4611087653cc6be31faa0911df2dfe951ec',
        gas: 4700000
      }).then( response => {
      console.log("Writerrrr:::", response);
      result.next(response);
    });
    return result;
  }

}
