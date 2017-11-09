import {Injectable, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';
import http from 'axios';

import IndexContract from '../../../../contracts/Index.json';
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
  indexContractOM: any;
  indexContract: any;

  ngOnInit(): void {
  }

  constructor() {
    this.provider = new Web3.providers.HttpProvider('http://localhost:8101');
    this.registrarOM = contract(RegistrarContract);
    this.indexContractOM = contract(IndexContract);
    this.registrarOM.setProvider(this.provider);
    this.indexContractOM.setProvider(this.provider);
    console.log('sssssssssssssssssHHHHHHHHHHHHHHHHHHHHHHHHHHHHssssssssssssssssssss');

    this.registrarOM.at('0x7e2aae2be60afe540ab5f6cc6a6c2280d7c06df8').then(r => {
      console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', r.address);
      this.registrar = r;
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
    this.indexContractOM.new(
      _owner,
      _isLearningProvider,
      {
      from: creator,
      gas: gas
    }).then(indexContractInstance => {
      console.log(indexContractInstance.address);
      return result.next(indexContractInstance);
    });
    return result;
  }

}
