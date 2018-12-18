import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {DbService} from "../../services/db.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {SessionStateService} from "../../services/global/session-state.service";
import {SelectOption} from "../../models/SelectOption";
import StatementSpecs from "../../../../src/record_type.json";
import axios from 'axios';
import JSONFormatter from 'json-formatter-js';
import formatterJS from 'json-formatter-js/dist/json-formatter.js';
import {isNullOrUndefined} from "util";


@Component({
  selector: 'app-learning-records',
  templateUrl: './learning-records.component.html',
  styleUrls: ['./learning-records.component.css']
})
export class LearningRecordsComponent implements OnInit {
  public mainTitle = 'Learning Logs';
  public subTitle = 'My Logs';
  showAddForm: boolean;
  registeredParticipants: [any];
  public noAccount: boolean;
  public user: any;
  public providerAddress: string;
  public recordType: string;
  public recordTypesList: Array<SelectOption>;
  public providers: Array<SelectOption>;
  private rawProviders = [];
  public learningRecords = [];
  private indexContractAddress: string;
  public recordInfos = {};
  public rawInfos: any;
  public message: any;
  public showMessage: boolean;
  public currentView = "home";
  public selectedSchool: string;
  public selectedLearner: string;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (!isNullOrUndefined(params['school_address'])) {
        this.selectedSchool = params['school_address'];
      }

      if (params['view'] !== null && params['view'] !== undefined) {
        console.log(this.currentView);
        this.currentView = params['view'];
        console.log(this.currentView);
      } else {
        console.log(this.route.snapshot.params['view']);
      }
    });
  }

  ngOnInit() {
    /*this.indexContractService.createRecordTest().subscribe(res => {
      console.log("SSSSSSSSSSSS", res);
    }, error2 => {
      console.log("Error:::::", error2);
    });*/
    this.user = this.sessionStateService.getUser();
    this.recordTypesList = new Array<SelectOption>();
    StatementSpecs[0].actions.forEach((value, index) => {
      this.recordTypesList.push(new SelectOption(value['value'], value['label'], 1));
    });
    this.dbService.getRegisteredNodes(this.user['accounts'][0], this.user['token']).subscribe(response => {
      console.log(response);
      this.registeredParticipants = response.data;
    });
    this.user = this.sessionStateService.getUser();
    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      console.log("loading index contract");
      this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
    }
  }

  loadLearningProviders(indexContractAddress, ownerAddress) {
    this.indexContractService.getMyLearningProviders(indexContractAddress, ownerAddress).subscribe(response => {
      this.rawProviders = response;
      console.log("providers ", response);
      this.loadLearningRecords('provider', this.rawProviders);
      this.loadProviders(response);
    });
  }

  private loadProviders(response) {
    this.providers = new Array<SelectOption>();
    response.forEach((value, index) => {
      this.providers.push(new SelectOption(value, value, index));
    });
  }

  loadLearningRecords(type, providers) {
    if (type === 'provider') {
      providers = providers === null ? this.rawProviders : providers;
      providers.forEach((providerAddress, index) => {
        if (providerAddress !== null && providerAddress !== undefined) {
          this.indexContractService.getRecordsByLearningProvider(this.indexContractAddress, providerAddress).subscribe(records => {
            console.log("Records ", records);
            if (records !== null && records.length > 0 && records[0] !== "0x0000000000000000000000000000000000000000") {
              this.learningRecords = records;
              for (let i = 0; i < records.length; i++) {
                this.loadLearningRecordInfo(records[i]);
                this.indexContractService.getLearningRecordSize(records[i]).subscribe(count => {
                  this.loadLearningRecordDeepInfo(records[i], parseInt(count, 16));
                });
              }
            } else {
              this.loadMessage("No records found", true);
            }
          });
        }
      });
    } else {
      if (this.recordType !== undefined && this.recordType !== null) {
        console.log("sssssssss ", this.recordType, this.sessionStateService.recordTypesToUniqueId[this.recordType]);
        this.indexContractService.getRecordsByType(this.indexContractAddress,
          this.sessionStateService.recordTypesToUniqueId[this.recordType]).subscribe(records => {
          console.log(records, this.currentView);
          if (records !== null && records.length > 0 && records[0] !== "0x0000000000000000000000000000000000000000") {
            this.learningRecords = records;
            for (let i = 0; i < records.length; i++) {
              this.loadLearningRecordInfo(records[i]);
              this.indexContractService.getLearningRecordSize(records[i]).subscribe(count => {
                this.loadLearningRecordDeepInfo(records[i], parseInt(count, 10));
              });
            }
          } else {
            this.loadMessage("No records found", true);
          }
        });
      }
    }
  }

  loadIndexContractAddress(ownerAddress, registrarAddress) {
    this.registrarService.getIndexContract(ownerAddress).subscribe(response => {
      if (response && response !== "0x0000000000000000000000000000000000000000") {
        this.indexContractAddress = response;
        console.log("User is:::", ownerAddress, "Index Contract:::", response);
        /*this.indexContractService.insertRecordTest(this.indexContractAddress, "").subscribe(response2 => {
          console.log("CCCCCCCCCCCC" + response2);
        }, error2 => {
          console.log("Error:::::" + error2);
        });*/
        this.loadLearningProviders(response, this.sessionStateService.getUser()['accounts'][0]);
      } else {
        console.log(response, "no index contract", registrarAddress, ownerAddress);
      }
    });
  }

  setShowAddForm(show) {
    console.log('sssss', show);
    this.showAddForm = show;
  }

  loadLearningRecordInfo(recordAddress) {
    this.indexContractService.loadLearningRecordInfo(recordAddress).subscribe(response => {
      this.recordInfos[recordAddress] = response;
      console.log("XXXXXXXXVVVVV", this.recordInfos);
    }, error => {
      console.log(error);
    });
  }

  loadLearningRecordDeepInfo(recordAddress, recordSize) {
    this.indexContractService.getRawLearningRecord(recordAddress, 0, parseInt(recordSize, 16)).subscribe(response => {
      console.log("W::: ", response);
      response.forEach((record, index) => {
        if (!isNullOrUndefined(this.selectedSchool)) {
          if (this.selectedSchool === record['writer']) {
            record['contractAddress'] = recordAddress;
            this.getRecord(record);
          }
        }else {
          record['contractAddress'] = recordAddress;
          this.getRecord(record);
        }
      });
    }, error => {
      console.log(error);
    });
  }

  public getRecord(info) {
    const url = info.queryHash;
    axios.get(url).then(response => {
      console.log(response.data);
      info['rawData'] = new JSONFormatter(response.data, Infinity).render();
      if (isNullOrUndefined(this.rawInfos)){
        this.rawInfos = [];
      }
      this.rawInfos.push(info);
      console.log("After", this.rawInfos);
    }).catch(error => {
      console.log(error);
    });
  }

  public uniqueRecord(info) {
    return info !== null ? info.queryResultHash : null;
  }

  onSelected(event) {
    console.log(event);
    this.recordType = event.value;
  }

  onSelectedProvider(event) {
    console.log(event);
    this.providerAddress = event.value;
  }

  loadMessage(message, show) {
    if (message !== null && message !== undefined) {
      this.message = message;
    }
    this.showMessage = show;
  }
}
