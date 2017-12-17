import {Injectable, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';
import http from 'axios';

import UserIndexContract from '../../../../contracts/UserIndex.json';
import ProviderIndexContract from '../../../../contracts/ProviderIndex.json';
import LearnerLearningProviderContract from '../../../../contracts/LearnerLearningProvider.json';
import RegistrarContract from '../../../../contracts/Registrar.json';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import index from '@angular/cli/lib/cli';
import {log} from 'util';

@Injectable()
export class RegistrarContractService implements OnInit {
  registrarOM: any;
  registrar: any;
  provider: any;
  userIndexContractOM: any;
  providerIndexContractOM: any;
  indexContract: any;
  registrarAddress: string = '0xe223466183d84da6a6fbf1d1c21f8f2b94eb2a5e';

  ngOnInit(): void {
  }

  constructor() {
    this.provider = new Web3.providers.HttpProvider('http://10.236.173.83:6060/node1');
    this.registrarOM = contract(RegistrarContract);
    this.userIndexContractOM = contract(UserIndexContract);
    this.providerIndexContractOM = contract(ProviderIndexContract);
    this.registrarOM.setProvider(this.provider);
    this.providerIndexContractOM.setProvider(this.provider);
    this.userIndexContractOM.setProvider(this.provider);
  }

  registerParticipant(creator, eth_address, other_id, index_contract_address, is_learning_provider, status): Observable<any> {
    console.log(creator, eth_address, other_id, index_contract_address, is_learning_provider, status);
    const result = new ReplaySubject();
    this.registrarOM.at(this.registrarAddress).then(r => {
      console.log(r);
      r.register(
        eth_address,
        other_id.split('').map(function (x) {
          return x.charCodeAt(0);
        }),
        is_learning_provider, index_contract_address, {
          from: creator,
          gas: 2100000
        }).then(response => {
        console.log('Response:: ', response);
        if (response) {
          r.getOtherId(eth_address).then(answer => {
            console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSVVVVVVVVVVV::: ', answer);
          });
          http.post('/registrar/register/' + r.address,
            {
              public_address: eth_address,
              other_id: other_id,
              index_contract_address: index_contract_address,
              is_learning_provider: is_learning_provider,
              status: status
            });
          result.next(response);
        }
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }

  createIndexContract(creator, gas, _owner, _isLearningProvider): Observable<any> {
    console.log(this.indexContract);
    const result = new ReplaySubject();
    if (_isLearningProvider) {
      this.providerIndexContractOM.new(
        _owner,
        {
          from: creator,
          gas: gas
        }).then(indexContractInstance => {
        console.log(indexContractInstance.address);
        return result.next(indexContractInstance);
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.userIndexContractOM.new(
        _owner,
        {
          from: creator,
          gas: gas
        }).then(indexContractInstance => {
        console.log(indexContractInstance.address);
        return result.next(indexContractInstance);
      }).catch(err => {
        console.log(err);
      });
    }
    return result;
  }

  getIndexContract(userAddress, registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.registrarOM.at(registrarAddress !== null ? registrarAddress : this.registrarAddress).then(r => {
      r.getIndexContract(userAddress).then(indexContractAddress => {
        result.next(indexContractAddress);
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }

  isLearningProvider(userAddress, registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.registrarOM.at(registrarAddress !== null ? registrarAddress : this.registrarAddress).then(r => {
      r.checkIsLearningProvider(userAddress).then(isLearningProvider => {
        result.next(isLearningProvider);
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }

  getStatus(userAddress, registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.registrarOM.at(registrarAddress !== null ? registrarAddress : this.registrarAddress).then(r => {
      r.getStatus(userAddress).then(status => {
        result.next(status);
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }
}
