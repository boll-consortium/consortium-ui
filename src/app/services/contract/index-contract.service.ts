import {Injectable, OnInit} from '@angular/core';
import contract from 'truffle-contract';
import Web3 from 'web3';
import LearnerLearningProviderContract from '../../../../contracts/LearnerLearningProvider.json';
import Config from '../../../../config.json';
import ProviderIndexContract from '../../../../contracts/ProviderIndex.json';
import UserIndexContract from '../../../../contracts/UserIndex.json';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {SessionStateService} from "../global/session-state.service";
import StatementSpecs from "../../../../src/record_type.json";
import {isNullOrUndefined} from "util";

@Injectable()
export class IndexContractService implements OnInit {
  userIndexContractOM: any;
  providerIndexContractOM: any;
  llpc: any;
  provider: any;
  accountType: string = "Learner";
  currentLLPC: any;

  ngOnInit(): void {
    this.initDefaultAccount();
  }

  initDefaultAccount(): void {
    if (!isNullOrUndefined(this.provider) && !isNullOrUndefined(this.sessionStateService.getUser())) {
      this.provider.eth.defaultAccount = this.sessionStateService.getUser()['accounts'][0];
    }
  }

  constructor(private sessionStateService: SessionStateService) {
    this.provider = new Web3(new Web3.providers.HttpProvider(Config['base_nodes'][0]));
    this.userIndexContractOM = contract(UserIndexContract);
    this.userIndexContractOM.setProvider(this.provider.currentProvider);
    this.providerIndexContractOM = contract(ProviderIndexContract);
    this.providerIndexContractOM.setProvider(this.provider.currentProvider);
    this.llpc = contract(LearnerLearningProviderContract);
    this.llpc.setProvider(this.provider.currentProvider);
  }

  getRecordsByLearningProvider(index_contract_address, learning_provider, start = 0, end = 10): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    console.log("SSSSSSSSSSSSSSS1");
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then(indexContract => {
      indexContract.getLearningRecordsByProvider(learning_provider).then(response => {
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

  getRecordsByType(index_contract_address, recordType: number): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then(indexContract => {
      console.log("Record Type In ASCII:", this.sessionStateService.fromAscii(recordType + ""), recordType);
      indexContract.getLearningRecordsByRecordType("0x" + this.sessionStateService.fromAscii(recordType + "")).then(response => {
        console.log(response);
        return result.next([response]);
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
    this.initDefaultAccount();
    console.log("SSSSSSSSSSSSSSS2");
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then(indexContract => {
      indexContract.getLearningRecordsByRecordTypeAndProviders(learning_providers, start, end, recordType).then(response => {
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
    this.initDefaultAccount();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    const indexContract = currentIndexContract.at(index_contract_address);
    indexContract.getProviders().then((response) => {
      console.log(response);
      result.next(response);
    });
    // console.log(indexContract.getProviders().send());
    return result;
  }

  insertRecordTest(index_contract_address, owner_address): Observable<any> {
    const result = new ReplaySubject();
    const currentIndexContract = this.accountType === 'Learner' ? this.userIndexContractOM : this.providerIndexContractOM;
    currentIndexContract.at(index_contract_address).then(indexContract => {
      indexContract.insertLearningRecord("0xa56ca4611087653cc6be31faa0911df2dfe951ec",
        "0x83493f1779d3e1adc53ed7c4e84ff70c7be332b9",
        "http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed",
        {
          from: '0xa56ca4611087653cc6be31faa0911df2dfe951ec',
          gas: 4700000
        }).then(response => {
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
      }).then(response => {
      console.log("Writerrrr:::", response);
      result.next(response);
    });
    return result;
  }

  loadLearningRecordInfo(llpcAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    const info = {};
    this.llpc.at(llpcAddress).then(response => {
      this.currentLLPC = response;
      response.getProvider().then(provider => {
        info["provider"] = provider;
        if (this.allSet(info)) {
          result.next(info);
        }
      });
      response.getPendingRequestsCount().then(res => {
        info["numberOfPendingRequests"] = res;
        if (this.allSet(info)) {
          result.next(info);
        }
      });
      response.getLearningRecordsCount().then(res => {
        info["numberOfLearningRecords"] = res;
        if (this.allSet(info)) {
          result.next(info);
        }
      });
      response.getRecordType().then(res => {
        const asciiEquivalent = this.sessionStateService.toAscii(res.toString(16));
        console.log("REC_TY:", asciiEquivalent);

        const recordDetails = this.getRecordDetails(asciiEquivalent);

        info["recordType"] = recordDetails["recordType"];
        info["recordLabel"] = recordDetails["recordLabel"];

        if (this.allSet(info)) {
          result.next(info);
        }
      });
    }).catch(error => {
      console.log(error);
    });
    return result;
  }

  getLearningRecordSize(llpcAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    this.llpc.at(llpcAddress).then(response => {
      this.currentLLPC = response;
      response.getLearningRecordsCount().then(res => {
        console.log("Records count is :: ", res, llpcAddress);
        result.next(res);
      });
    }).catch(error => {
      console.log(error);
    });
    return result;
  }

  getRawLearningRecord(llpcAddress, currentSize, size): Observable<any> {
    const resultFinal = new ReplaySubject();
    this.initDefaultAccount();
    ((result) => {
      const records = [];
      let k = 0;
      console.log("Startize: ", size);
      this.llpc.at(llpcAddress).then(response => {
        for (let i = 0; i < size; i++) {
          console.log("Size: ", currentSize + i);
          response.getLearningRecord(currentSize + i).then(record => {
            console.log("D::: ", record);
            records.push({queryResultHash: record[0], queryHash: record[1], writer: record[2]});
            k++;
            console.log(k, size);
            if (k === size) {
              console.log(size, k);
              result.next(records);
            }
          }).catch((error) => {
            console.log("Error is", error, k, currentSize, size);
            k++;
            if (k === size) {
              console.log(size, k);
              result.next(records);
            }
          });
        }
      }).catch(error => {
        console.log(error);
      });
    })(resultFinal);
    return resultFinal;
  }

  getPermissionRequests(llpcAddress): Observable<any> {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    this.llpc.at(llpcAddress).then(response => {
      response.getPendingRequests().then(requests => {
        console.log("Req::: ", requests);
        result.next(requests);
      });
    });
    return result;
  }

  getPermissions(record, providers, isPending = false) {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    const permissions = {};
    const resultFinal = [];
    let counter = 0;
    this.llpc.at(record['contractAddress']).then(response => {
      console.log("Contract found ::: ", response);
      console.log("providers are::", providers);
      providers.forEach((provider, index) => {
        console.log("provider is::", provider);
        permissions[provider] = {count: 0, status: ''};
        response.canGrant(provider, isPending).then(status => {
          console.log("Req::: ", status);
          permissions[provider].count++;
          if (permissions[provider].status === '') {
            permissions[provider].status = status ? 'Admin' : '';
          } else {
            permissions[provider].status = permissions[provider].status + ', ' + (status ? 'Admin' : '');
          }
          if (permissions[provider].count === 3) {
            resultFinal.push({
              contractAddress: record['contractAddress'], userAddress: provider,
              recordType: record['recordType'], status: permissions[provider].status, recordLabel: record['recordLabel']
            });
            counter++;
            if (counter === providers.length) {
              result.next(resultFinal);
            }
          }
        });
        response.canWrite(provider, isPending).then(status => {
          console.log("Req::: ", status);
          permissions[provider].count++;
          if (permissions[provider].status === '') {
            permissions[provider].status = status ? 'Write' : '';
          } else {
            permissions[provider].status = permissions[provider].status + ', ' + (status ? 'Write' : '');
          }
          if (permissions[provider].count === 3) {
            resultFinal.push({
              contractAddress: record['contractAddress'], userAddress: provider,
              recordType: record['recordType'], status: permissions[provider].status, recordLabel: record['recordLabel']
            });
            counter++;
            if (counter === providers.length) {
              result.next(resultFinal);
            }
          }
        });
        response.canRead(provider, isPending).then(status => {
          console.log("Req::: ", status);
          permissions[provider].count++;
          if (permissions[provider].status === '') {
            permissions[provider].status = status ? 'Read' : '';
          } else {
            permissions[provider].status = permissions[provider].status + ', ' + (status ? 'Read' : '');
          }
          if (permissions[provider].count === 3) {
            resultFinal.push({
              contractAddress: record['contractAddress'], userAddress: provider,
              recordType: record['recordType'], status: permissions[provider].status, recordLabel: record['recordLabel']
            });
            counter++;
            if (counter === providers.length) {
              result.next(resultFinal);
            }
          }
        });
      });
    });
    return result;
  }

  getPermissionsOnly(record, provider, isPending = false) {
    const result = new ReplaySubject();
    this.initDefaultAccount();
    const permissions = {count: 0, status: ''};
    const resultFinal = [];
    this.llpc.at(record['contractAddress']).then(response => {
      console.log("Contract found ::: ", response);
      response.canGrant(provider, isPending).then(status => {
        console.log("Req::: ", status);
        permissions[provider].count++;
        if (permissions.status === '') {
          permissions.status = status ? 'Admin' : '';
        } else {
          permissions.status = permissions.status + ', ' + (status ? 'Admin' : '');
        }
        if (permissions.count === 3) {
          resultFinal.push({
            contractAddress: record['contractAddress'], userAddress: provider,
            recordType: record['recordType'], status: permissions.status, recordLabel: record['recordLabel']
          });
          result.next(resultFinal);
        }
      });
      response.canWrite(provider, isPending).then(status => {
        console.log("Req::: ", status);
        permissions.count++;
        if (permissions.status === '') {
          permissions.status = status ? 'Write' : '';
        } else {
          permissions.status = permissions.status + ', ' + (status ? 'Write' : '');
        }
        if (permissions.count === 3) {
          resultFinal.push({
            contractAddress: record['contractAddress'], userAddress: provider,
            recordType: record['recordType'], status: permissions.status, recordLabel: record['recordLabel']
          });
          result.next(resultFinal);
        }
      });
      response.canRead(provider, isPending).then(status => {
        console.log("Req::: ", status);
        permissions.count++;
        if (permissions.status === '') {
          permissions.status = status ? 'Read' : '';
        } else {
          permissions.status = permissions.status + ', ' + (status ? 'Read' : '');
        }
        if (permissions.count === 3) {
          resultFinal.push({
            contractAddress: record['contractAddress'], userAddress: provider,
            recordType: record['recordType'], status: permissions.status, recordLabel: record['recordLabel']
          });
          result.next(resultFinal);
        }
      });
    });
    return result;
  }

  private allSet(info): boolean {
    console.log(info);
    return (info["numberOfPendingRequests"] !== undefined && info["recordType"] !== undefined
      && info["numberOfLearningRecords"] !== undefined && info["provider"] !== undefined);
  }

  getRecordType(recordAddress: any): Observable<any> {
    const result = new ReplaySubject();

    this.llpc.at(recordAddress).then(response => {
      console.log("Contract type ::: ", response);

      response.getRecordType().then(res => {
        const asciiEquivalent = this.sessionStateService.toAscii(res.toString(16));
        console.log("REC_TY:", asciiEquivalent);


        result.next(this.getRecordDetails(asciiEquivalent));
      });
    }).catch(error => {
      console.log(error);
      result.next(error);
    });

    return result;
  }

  private getRecordDetails(asciiEquivalent: string) {
    const finalResponse = {};
    if (!isNaN(Number(asciiEquivalent))) {
      const recordUniqueIndex = Number(asciiEquivalent);
      const statementSpec = StatementSpecs.find(spec => {
        return (recordUniqueIndex >= spec.starting_index && ((recordUniqueIndex <= spec.actions.length)) || ((recordUniqueIndex - 1000) <= spec.actions.length && spec.starting_index == 1000));
      });
      if (!isNullOrUndefined(statementSpec)) {
        finalResponse["recordType"] = statementSpec.starting_index == 1000 ? statementSpec.actions[recordUniqueIndex - 1000].value : statementSpec.actions[recordUniqueIndex].value;
        finalResponse["recordLabel"] = statementSpec.starting_index == 1000 ? statementSpec.actions[recordUniqueIndex - 1000].label : statementSpec.actions[recordUniqueIndex].label;
      } else {
        finalResponse["recordType"] = asciiEquivalent;
        finalResponse["recordLabel"] = asciiEquivalent;
      }
    } else {
      finalResponse["recordType"] = asciiEquivalent;
      finalResponse["recordLabel"] = asciiEquivalent;
    }

    return finalResponse;
  }

}
