import {Injectable, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';
import http from 'axios';

import UserIndexContract from '../../../../contracts/UserIndex.json';
import ProviderIndexContract from '../../../../contracts/ProviderIndex.json';
import LearnerLearningProviderContract from '../../../../contracts/LearnerLearningProvider.json';
import RegistrarContract from '../../../../contracts/Registrar.json';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
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
    console.log('sssssssssssssssssHHHHHHHHHHHHHHHHHHHHHHHHHHHHssssssssssssssssssss');

    this.registrarOM.at('0x122603d373c8aefdec1166d9c098550448bf935b').then(r => {
      console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', r.address);
      this.registrar = r;
    }).catch(error => {
      console.log(error.message);
      if (error.message.indexOf('no code at address') !== -1) {

      }
    });
  }

  registerParticipant(creator, eth_address, other_id, index_contract_address, is_learning_provider, status): Observable <any> {
    console.log(creator, eth_address, other_id, index_contract_address, is_learning_provider, status);
    const result = new ReplaySubject();
    this.registrar.register(
      eth_address,
      other_id.split('').map(function(x) { return x.charCodeAt(0); }),
      is_learning_provider, index_contract_address, {
      from: creator,
      gas: 2100000
    }).then(response => {
      console.log('Response:: ', response);
      if (response) {
        this.registrar.getOtherId(eth_address).then(answer => {
          console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSVVVVVVVVVVV::: ', answer);
        });
        http.post('/registrar/register/' + this.registrar.address,
          {public_address: eth_address,
            other_id: other_id,
            index_contract_address: index_contract_address,
            is_learning_provider: is_learning_provider,
            status: status});
        return result.next(response);
      }
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
    }else {
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

}
