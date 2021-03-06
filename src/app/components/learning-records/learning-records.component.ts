import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {DbService} from "../../services/db.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {SessionStateService} from "../../services/global/session-state.service";
import {SelectOption} from "../../models/SelectOption";
import StatementSpecs from "../../../../src/record_type.json";
import JSONFormatter from 'json-formatter-js';
import {isNullOrUndefined} from "util";
import {HttpInterceptorService} from "../../services/http/http-interceptor.service";
import {HighlightTransformer} from "../../shared/util/HighlightTransformer";
import {Pagination} from "../../abstracts/pagination";
import {AuthCredentialsService} from "../../services/auth/auth-credentials/auth-credentials.service";


@Component({
  selector: 'app-learning-records',
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
  public searchText: string;
  public preSearchText: string;
  private schoolsChecked = {};
  public counter = Array;
  public BASE_PATH = AuthCredentialsService.AUTH_SERVER_URL;

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
      if (!isNullOrUndefined(params['school_address'])) {
        this.selectedSchool = params['school_address'];
      }

      if (params['view'] !== null && params['view'] !== undefined) {
        console.log(this.currentView);
        this.currentView = params['view'];
      } else {
      }
    });
  }

  loadMoreRecords(records) {
    if (!isNullOrUndefined(records) && records.length > 0) {
      this.zone.runOutsideAngular(() => {
        let totalSize = records.length;
        let nextStart = this.currentPage * this.itemsPerPage;

        if (nextStart < totalSize) {
          let nextEnd = (this.currentPage + 1) * this.itemsPerPage;
          this.preLoadLearningRecordDeepInfo(records, nextStart, nextEnd);
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
    this.user = this.sessionStateService.getUser();
    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      this.zone.runOutsideAngular(() => {
        this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
      });
    }
  }

  loadLearningProviders(indexContractAddress, ownerAddress) {
    this.indexContractService.getMyLearningProviders(indexContractAddress, ownerAddress).subscribe(response => {
      this.rawProviders = response;
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
            if (records !== null && records.length > 0 && records[0] !== "0x0000000000000000000000000000000000000000") {
              this.learningRecords = records;
              this.lastPage = (this.currentPage * this.itemsPerPage) > this.learningRecords.length;
              this.preLoadLearningRecordDeepInfo(records, 0, this.itemsPerPage);
            } else {
              this.loadMessage("No records found", true);
            }
          });
        }
      });
    } else {
      if (this.recordType !== undefined && this.recordType !== null) {
        this.indexContractService.getRecordsByType(this.indexContractAddress,
          this.sessionStateService.recordsToUniqueId(this.recordType)).subscribe(records => {
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
        this.loadLearningProviders(response, this.sessionStateService.getUser()['accounts'][0]);
      } else {
        console.log(response, "no index contract", registrarAddress, ownerAddress);
      }
    });
  }

  setShowAddForm(show) {
    this.showAddForm = show;
  }

  loadLearningRecordInfo(recordAddress) {
    this.indexContractService.loadLearningRecordInfo(recordAddress).subscribe(response => {
      this.recordInfos[recordAddress] = response;
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
    this.indexContractService.getRawLearningRecord(recordAddress, 0, parseInt(recordSize, 10)).subscribe(response => {
      this.httpInterceptorService.axiosInstance.get(this.BASE_PATH + "sb/identity/sign_data_retrieval_message", {
        data: {},
        headers: {
          'Authorization': btoa(this.user['accounts'][0] + ':' + this.user['token']),
          'Content-Type': "application/json"
        }
      }).then(
        (signedMessageResponse) => {
          console.log('signed message', signedMessageResponse);
          response.forEach((record, index) => {
            if (!isNullOrUndefined(this.selectedSchool)) {
              if (this.selectedSchool === record['writer']) {
                record['contractAddress'] = recordAddress;
                this.getRecord(record, signedMessageResponse);
              }
            } else {
              record['contractAddress'] = recordAddress;
              this.getRecord(record, signedMessageResponse);
            }
          });
        }).catch((error) => {
        console.log(error);
      });

    }, error => {
      console.log(error);
    });
  }

  public getRecord(info, signedMessageResponse) {
    let url = info.queryHash;
    this.httpInterceptorService.axiosInstance.post(url, {
      messageWithSignature: !isNullOrUndefined(signedMessageResponse.data) ? JSON.stringify(signedMessageResponse.data) : undefined,
      token: this.user['token'],
      bollAddress: this.user['accounts'][0]
    }).then(response => {
      this.resolveRecordInfoResponse(response, info);
    }).catch(error => {
      console.log(error);
      let datasiteAddress = this.getSchoolDetails_datasiteAddress(info['writer']);
      if (isNullOrUndefined(datasiteAddress)) {
        datasiteAddress = AuthCredentialsService.AUTH_SERVER_URL + 'lrs/blockchain/';
      }
      const urlParts = url.split('/');
      url = datasiteAddress + urlParts[urlParts.length - 1];
      console.log('URL is ', url);
      this.httpInterceptorService.axiosInstance.post(url, {
        messageWithSignature: !isNullOrUndefined(signedMessageResponse.data) ? JSON.stringify(signedMessageResponse.data) : undefined,
        token: this.user['token'],
        bollAddress: this.user['accounts'][0]
      }).then(response => {
        this.resolveRecordInfoResponse(response, info);
      }).catch(error => {
        console.log('Final', error);
      });
    });
  }

  private resolveRecordInfoResponse(response: any, info: any) {
    info['rawData'] = new JSONFormatter(response.data, Infinity).render();
    if (isNullOrUndefined(this.rawInfos)) {
      this.rawInfos = [];
    }
    this.zone.run(() => {
      this.rawInfos.push(info);
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
          school = this.sessionStateService.getSchool(schoolAddress);
        });
      }
    } else {
      const highlightedSchool = HighlightTransformer.prototype.transform(school.name, this.searchText);
      const schoolDesign = "<div class='product-img'>\n" +
      "              <img alt=logo' class='img-circle' src='" +
        (!isNullOrUndefined(school.logo) ? school.logo : (this.BASE_PATH +'assets/dist/img/school.png')) + "'>\n" + highlightedSchool + "</div>";
      return schoolDesign;
    }
    return schoolAddress;
  }

  getSchoolDetails_Name(schoolAddress: string): string {
    let school = this.sessionStateService.getSchool(schoolAddress);
    if (isNullOrUndefined(school)) {
      if (isNullOrUndefined(this.schoolsChecked[schoolAddress])) {
        this.schoolsChecked[schoolAddress] = true;
        this.dbService.getSchool(this.user['accounts'][0], this.user['token'], schoolAddress).subscribe(response => {
          school = this.sessionStateService.getSchool(schoolAddress);
        });
      }
    } else {
      // const highlightedSchool = HighlightTransformer.prototype.transform(school.name, this.searchText);
      const schoolDesign = "<div class='text-center'>\n" + school.name + "</div>";
      return schoolDesign;
    }
    // return schoolAddress;
  }

  getSchoolDetails_datasiteAddress(schoolAddress: string): string {
    let school = this.sessionStateService.getSchool(schoolAddress);
    if (isNullOrUndefined(school)) {
      if (isNullOrUndefined(this.schoolsChecked[schoolAddress])) {
        this.schoolsChecked[schoolAddress] = true;
        this.dbService.getSchool(this.user['accounts'][0], this.user['token'], schoolAddress).subscribe(response => {
          school = this.sessionStateService.getSchool(schoolAddress);
          return school.datasiteAddress;
        });
      }
    } else {
      return school.datasiteAddress;
    }
    // return schoolAddress;
  }

  parseInt(val): number {
    return parseInt(val, 10);
  }

  filterBySearchText() {
    if (this.preSearchText !== this.searchText) {
      this.searchText = this.preSearchText;
    }
  }

  downloadAllData() {
    // ToDo
  }
}
