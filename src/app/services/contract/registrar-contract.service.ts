import {Injectable, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';

import UserIndexContract from '../../../../contracts/UserIndex.json';
import ProviderIndexContract from '../../../../contracts/ProviderIndex.json';
import RegistrarContract from '../../../../contracts/Registrar.json';
import Config from '../../../../config.json';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {isNullOrUndefined} from 'util';
import {SessionStateService} from "../global/session-state.service";
import {HttpInterceptorService} from "../http/http-interceptor.service";

@Injectable()
export class RegistrarContractService implements OnInit {
  registrarOM: any;
  registrar: any;
  provider: any;
  userIndexContractOM: any;
  providerIndexContractOM: any;
  indexContract: any;
  registrarAddress = '0x3439a34a71e0cebb27545b93d737a5582d6cc791';
  Wb3: any;

  ngOnInit(): void {
    this.initDefaultAccount();
  }
  initDefaultAccount(): void {
    if (!isNullOrUndefined(this.provider) && !isNullOrUndefined(this.sessionStateService.getUser())) {
      this.provider.eth.defaultAccount = this.sessionStateService.getUser()['accounts'][0];
    }
  }

  constructor(private sessionStateService: SessionStateService,
              private httpInterceptorService: HttpInterceptorService) {
    this.provider = new Web3(new Web3.providers.HttpProvider(Config['base_nodes'][0]));
    this.registrarOM = contract(RegistrarContract);
    this.userIndexContractOM = contract(UserIndexContract);
    this.providerIndexContractOM = contract(ProviderIndexContract);
    this.registrarOM.setProvider(this.provider.currentProvider);
    this.providerIndexContractOM.setProvider(this.provider.currentProvider);
    this.userIndexContractOM.setProvider(this.provider.currentProvider);
    if (typeof this.Wb3 !== 'undefined') {
      this.Wb3 = new Web3(Web3.currentProvider);
    } else {
      this.Wb3 = new Web3(this.provider);
    }
  }

  registerParticipant(creator, eth_address, other_id, index_contract_address, is_learning_provider, status): Observable<any> {
    console.log(creator, eth_address, other_id, index_contract_address, is_learning_provider, status);
    const result = new ReplaySubject();
    this.httpInterceptorService.axiosInstance.post('/registrar/register_account',
      {
        creator: creator,
        owner: eth_address,
        otherId: other_id,
        isLearningProvider: is_learning_provider,
        registrarAddress: this.registrarAddress,
        userStatus: status,
        gas: 2100000,
        indexContractAddress: index_contract_address
      }).then((response) => {
      if (response) {
        const txHash = response.data.replace("REGISTER_HASH:::", "").replace(/[\r\n]/g, "").replace(" ", "");
        console.log(txHash);
        let txRcpt = Web3.eth.getTransactionReceipt(txHash);
        console.log(txRcpt);
        const watcher = setInterval(() => {
          if (txRcpt.blockNumber !== undefined && txRcpt.blockNumber !== null) {
            result.next(txRcpt.contractAddress);
            clearInterval(watcher);
          } else {
            txRcpt = Web3.eth.getTransactionReceipt(txHash);
          }
        }, 5000);
      }
    }).catch(error => {
      console.log(error);
      result.error(error);
    });
    return result;
  }

  createIndexContract(creator, gas, _owner, _isLearningProvider, userStatus, registrarAddress, otherId): Observable<any> {
    console.log(this.indexContract);
    const result = new ReplaySubject();
    this.httpInterceptorService.axiosInstance.post('/app/registrar/create_index',
      {
        creator: creator,
        owner: _owner,
        otherId: otherId,
        isLearningProvider: _isLearningProvider,
        registrarAddress: registrarAddress,
        gas: 1000000,
        userStatus: userStatus
      }).then((response) => {
        if (response) {
          const txHash = response.data.replace("INDEX_CONTRACT_HASH:::", "").replace(/[\r\n]/g, "").replace(" ", "");
          let txRcpt = Web3.eth.getTransactionReceipt(txHash);
          console.log(txRcpt);
          const watcher = setInterval(() => {
            if (txRcpt.blockNumber !== undefined && txRcpt.blockNumber !== null && txRcpt.contractAddress) {
              result.next(txRcpt.contractAddress);
              clearInterval(watcher);
            } else {
              txRcpt = Web3.eth.getTransactionReceipt(txHash);
            }
          }, 5000);
        }
    }).catch(error => {
      console.log(error);
      result.error(error);
    });
    return result;
  }

  getIndexContract(userAddress, registrarAddress = this.registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    this.registrarOM.at(registrarAddress).then(r => {
      r.getIndexContract(userAddress).then(indexContractAddress => {
        console.log("fffff", userAddress, registrarAddress, this.registrarAddress);
        result.next(indexContractAddress);
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }

  isLearningProvider(userAddress, registrarAddress = this.registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    this.registrarOM.at(registrarAddress).then(r => {
      r.checkIsLearningProvider(userAddress).then(isLearningProvider => {
        result.next(isLearningProvider);
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }

  getStatus(userAddress, registrarAddress = this.registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    this.registrarOM.at(registrarAddress).then(r => {
      r.getStatus(userAddress).then(status => {
        result.next(status);
      });
    }).catch(error => {
      console.log(error.message);
      result.error(error);
    });
    return result;
  }

  isApproved(blockchainAddress: string, accessToken: string, registrarAddress = this.registrarAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    this.registrarOM.at(registrarAddress).then(r => {
      r.isApprovedInstitute(accessToken, blockchainAddress).then(approved => {
        result.next(approved);
      }).catch(error => {
        console.log(error.message);
        result.error(error);
      });
    });
    return result;
  }
}
