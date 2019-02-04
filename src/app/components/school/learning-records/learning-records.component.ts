import {Component, Input, NgZone, OnInit} from '@angular/core';
import {SelectOption} from "../../../models/SelectOption";
import {DbService} from "../../../services/db.service";
import {SessionStateService} from "../../../services/global/session-state.service";
import {IndexContractService} from "../../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../../services/contract/registrar-contract.service";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpInterceptorService} from "../../../services/http/http-interceptor.service";
import JSONFormatter from 'json-formatter-js';
import {isNullOrUndefined} from "util";
import StatementSpecs from "../../../../../src/record_type.json";
import {Pagination} from "../../../abstracts/pagination";

@Component({
  selector: 'app-school-learning-records',
  templateUrl: './learning-records.component.html',
  styleUrls: ['./learning-records.component.css']
})
export class LearningRecordsComponent extends Pagination implements OnInit {
  public mainTitle = 'Learning Logs';
  public subTitle = 'My Logs';
  showAddForm: boolean;
  public noAccount: boolean;
  public user: any;
  public providerAddress: string;
  public recordType: string;
  objectKeys = Object.keys;
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
  @Input()
  public selectedSchoolAddress: string;
  private schoolsChecked = {};
  selectedRecord: string;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute,
              private httpInterceptorService: HttpInterceptorService,
              private zone: NgZone) {
    super();
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.lastPage = false;

    this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (params['view'] !== null && params['view'] !== undefined) {
        console.log(this.currentView);
        this.currentView = params['view'];
        console.log(this.currentView);
      } else {
        console.log(this.route.snapshot.params['view']);
      }
    });
  }

  loadMoreRecords(records, loadMoreFunction) {
    if (!isNullOrUndefined(records) && records.length > 0) {
      this.zone.runOutsideAngular(() => {
        let totalSize = records.length;
        let nextStart = this.currentPage * this.itemsPerPage;

        if (nextStart < totalSize) {
          let nextEnd = (this.currentPage + 1) * this.itemsPerPage;
          loadMoreFunction(records, nextStart, nextEnd);
          this.currentPage = this.currentPage + 1;

          this.lastPage = (this.currentPage * this.itemsPerPage) > totalSize;
        }
      });
    }
  }

  ngOnInit() {
    /*this.indexContractService.createRecordTest().subscribe(res => {
      console.log("SSSSSSSSSSSS", res);
    }, error2 => {
      console.log("Error:::::", error2);
    });*/
    this.user = this.sessionStateService.getUser();
    this.recordTypesList = new Array<SelectOption>();
    StatementSpecs[1].actions.forEach((value, index) => {
      this.recordTypesList.push(new SelectOption(value['value'], value['label'], 1));
    });
    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      console.log("loading index contract");
      this.zone.runOutsideAngular(() => {
        this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
      });
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
        this.loadLearningRecords('provider', [this.selectedSchoolAddress]);
      } else {
        console.log(response, "no index contract", registrarAddress, ownerAddress);
      }
    });
  }

  loadLearningRecords(type, providers) {
    if (type === 'provider') {
      providers = providers === null ? this.rawProviders : providers;
      const providerAddress = (!isNullOrUndefined(providers) && providers.length > 0) ? providers[0] : null;

      if (!isNullOrUndefined(providerAddress)) {
        this.indexContractService.getRecordsByLearningProvider(this.indexContractAddress, providerAddress).subscribe(records => {
          console.log("Records ", records);
          if (records !== null && records.length > 0 && records[0] !== "0x0000000000000000000000000000000000000000") {
            this.learningRecords = records;
            this.lastPage = (this.currentPage * this.itemsPerPage) > this.learningRecords.length;
            this.preLoadLearningRecordDeepInfo(records, 0, this.itemsPerPage);
          } else {
            this.loadMessage("No records found", true);
          }
        });
      }
    } else {
      if (this.recordType !== undefined && this.recordType !== null) {
        console.log("sssssssss ", this.recordType, this.sessionStateService.recordsToUniqueId(this.recordType));
        this.indexContractService.getRecordsByType(this.indexContractAddress,
          this.sessionStateService.recordsToUniqueId(this.recordType)).subscribe(records => {
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

  preLoadLearningRecordDeepInfo(records, start, end) {
    for (let i = start; i < records.length && i < end; i++) {
      this.loadLearningRecordInfo(records[i]);
      this.indexContractService.getLearningRecordSize(records[i]).subscribe(count => {
        this.loadLearningRecordDeepInfo(records[i], parseInt(count, 16));
      });
    }
  }

  loadLearningRecordDeepInfo(recordAddress, recordSize) {
    this.indexContractService.getRawLearningRecord(recordAddress, 0, parseInt(recordSize, 16)).subscribe(response => {
      console.log("W::: ", response);
      response.forEach((record, index) => {
        record['contractAddress'] = recordAddress;
        this.getRecord(record);
      });
    }, error => {
      console.log(error);
    });
  }

  public getRecord(info) {
    const url = info.queryHash;
    this.httpInterceptorService.axiosInstance.get(url).then(response => {
      console.log(response.data);
      info['rawData'] = new JSONFormatter(response.data, Infinity).render();
      if (isNullOrUndefined(this.rawInfos)) {
        this.rawInfos = {};
      }
      if (isNullOrUndefined(this.rawInfos[info['contractAddress']])) {
        this.rawInfos[info['contractAddress']] = [];
      }
      this.zone.run(() => {
        this.rawInfos[info['contractAddress']].push(info);
      });
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

  getSchoolDetails(schoolAddress: string): string {
    let school = this.sessionStateService.getSchool(schoolAddress);
    if (isNullOrUndefined(school)) {
      if (isNullOrUndefined(this.schoolsChecked[schoolAddress])) {
        this.schoolsChecked[schoolAddress] = true;
        this.dbService.getSchool(this.user['accounts'][0], this.user['token'], schoolAddress).subscribe(response => {
          console.log("I have got one more school...", response);
          school = this.sessionStateService.getSchool(schoolAddress);
        });
      }
    } else {
      const schoolDesign = "<div class='product-img'>\n" +
      "              <img alt=logo' class='img-circle' src='" +
      !isNullOrUndefined(school.logo) ? school.logo : 'assets/dist/img/school.png' + "'>\n" +
        "                <span class=''>" + school.name + "</span>";
      return schoolDesign;
    }
    return schoolAddress;
  }

  showRecordInfo(contractAddress: string, show: boolean) {
    this.selectedRecord = show ? contractAddress : null;
  }
}

