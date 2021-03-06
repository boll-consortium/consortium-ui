import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {DbService} from '../../../services/db.service';
import {SessionStateService} from "../../../services/global/session-state.service";
import {IndexContractService} from "../../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../../services/contract/registrar-contract.service";
import StatementSpecs from "../../../../../src/record_type.json";
import {SelectOption} from "../../../models/SelectOption";
import {ActivatedRoute, Params} from "@angular/router";
import {isNullOrUndefined} from "util";
import * as moment from "moment";
import {AuthServerService} from "../../../services/auth/auth-server.service";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Pagination} from "../../../abstracts/pagination";

@Component({
  selector: 'app-school-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent extends Pagination implements OnInit, AfterViewInit {
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
  public rawInfos = [];
  public permissionsInfo = [];
  public pendingPermissionsInfo = [];
  public message: any;
  private seen = {};
  private seen2 = {};
  public showMessage: boolean;
  public currentView = "home";
  @Input()
  public selectedSchoolAddress: string;
  public school: any;
  private latestInfo = {};
  errorMessage: string;
  successMessage: string;
  loading: boolean;
  public infoToUpdate = {
    pending: {},
    approved: {}
  };
  public approveAllCandidates = [];
  public statements: any;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute,
              private authService: AuthServerService,
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
    this.statements = StatementSpecs;
    this.recordTypesList = new Array<SelectOption>();
    StatementSpecs.forEach((statementSpec) => {
      statementSpec.actions.forEach((value) => {
        this.recordTypesList.push(new SelectOption(value['value'], value['label'], 1));
        this.approveAllCandidates[value['value']] = {admin: true, write: true, read: true};
      });
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
    this.user = this.sessionStateService.getUser();
    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      console.log("loading index contract");
      this.zone.runOutsideAngular(() => {
        this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
      });
    }

    this.school = this.sessionStateService.getSchool(this.selectedSchoolAddress);

    Observable.interval(30 * 1000).subscribe(() => {
      if (isNullOrUndefined(this.school)) {
        this.school = this.sessionStateService.getSchool(this.selectedSchoolAddress);
      }
      if (isNullOrUndefined(this.indexContractAddress)) {
        if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
          console.log("loading index contract");
          this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
        }
      }
    });
  }

  ngAfterViewInit(): void {
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
        this.rawProviders = [this.selectedSchoolAddress];
        this.loadLearningRecords('provider', this.rawProviders);
      } else {
        console.log(response, "no index contract", registrarAddress, ownerAddress);
      }
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
              this.lastPage = (this.currentPage * this.itemsPerPage) > this.learningRecords.length;
              this.loadPermissions(records, 0, this.itemsPerPage);
              //this.preLoadLearningRecordDeepInfo(records, 0, this.itemsPerPage);
            } else {
              this.loadMessage("No records found", true);
            }
          });
        }
      });
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
    const result = new ReplaySubject();
    this.indexContractService.loadLearningRecordInfo(recordAddress).subscribe(response => {
      this.recordInfos[recordAddress] = response;
      this.infoToUpdate[recordAddress] = {};
      console.log("XXXXXXXXVVVVV", this.recordInfos);
      result.next(response);
    }, error => {
      console.log(error);
      result.next(error);
    });

    return result;
  }

  loadNextPage() {
    const start = (this.currentPage) * this.itemsPerPage;
    this.loadPermissions(this.learningRecords, start, this.itemsPerPage);
    this.currentPage++;
  }

  loadPermissions(contractAddresses, start, size) {
    for (let i = start; (i < (start + size)) && (i < contractAddresses.length); i++) {
      const contractAddress = contractAddresses[i];
      this.loadLearningRecordInfo(contractAddress).subscribe(result => {
        if (!isNullOrUndefined(result) && !isNullOrUndefined(result['recordType'])) {
          const record = result;
          record['contractAddress'] = contractAddress;
          this.getPermissions(record, this.rawProviders, false);
          this.getPermissions(record, this.rawProviders, true);
        }
      });

    }
  }

  preLoadLearningRecordDeepInfo(records, start, end) {
    for (let i = start; i < records.length && i < end; i++) {
      this.indexContractService.getLearningRecordSize(records[i]).subscribe(count => {
        this.loadLearningRecordDeepInfo(records[i], parseInt(count, 16));
      });
    }
  }

  loadLearningRecordDeepInfo(recordAddress, recordSize) {
    if (recordSize > 0) {
      this.indexContractService.getRawLearningRecord(recordAddress, this.rawInfos.length, parseInt(recordSize, 10)).subscribe(response => {
        console.log("W::: ", response);
        response.forEach((record, index) => {
          record['contractAddress'] = recordAddress;
          this.zone.run(() => {
            this.rawInfos.push(record);
          });
          // this.getPermissionRequests(record);
          this.getPermissions(record, this.rawProviders, false);
          this.getPermissions(record, this.rawProviders, true);
        });
      }, error => {
        console.log(error);
      });
    } else {
      this.indexContractService.getRecordType(recordAddress).subscribe(recordDetails => {
        this.getPermissions({
          contractAddress: recordAddress,
          recordType: recordDetails.recordType,
          recordLabel: recordDetails.recordLabel
        }, this.rawProviders, false);
        this.getPermissions({
          contractAddress: recordAddress,
          recordType: recordDetails.recordType,
          recordLabel: recordDetails.recordLabel
        }, this.rawProviders, true);
      });
    }
  }

  getPermissionRequests(record) {
    this.indexContractService.getPermissionRequests(record['contractAddress']).subscribe(response => {
      if (response !== null && response !== undefined) {
        response.forEach((permission, index) => {
          this.permissionsInfo.push(
            {
              contractAddress: record['contractAddress'],
              userAddress: permission,
              writer: record['writer'],
              recordType: record['recordType'],
              status: 'PENDING'
            });
        });
      }
    });
  }

  getPermissions(record, providers, isPending) {
    if (this.seen[record['contractAddress']] && !isPending) {
      console.log("seen 1 returned early::", this.seen);
      return;
    } else if (this.seen2[record['contractAddress']] && isPending) {
      console.log("seen 2 returned early::", this.seen2);
      return;
    }
    if (!isPending) {
      this.seen[record['contractAddress']] = true;
    } else {
      this.seen2[record['contractAddress']] = true;
    }
    this.indexContractService.getPermissions(record, providers, isPending).subscribe(response => {
      console.log("permissions received:", response);
      if (response !== null && response !== undefined) {
        console.log("SSSSS", response);
        if (response instanceof Array) {
          response.forEach((permission, index) => {
            console.log("Update ubfi is = ", this.infoToUpdate);
            this.zone.run(() => {
              if (isPending) {
                if (!isNullOrUndefined(permission['status']) && permission['status'] !== '') {
                  this.infoToUpdate.pending[permission['contractAddress']] = {
                    admin: permission['status'].toLowerCase().indexOf('admin') !== -1,
                    read: permission['status'].toLowerCase().indexOf('read') !== -1,
                    write: permission['status'].toLowerCase().indexOf('write') !== -1
                  };
                  this.pendingPermissionsInfo.push(
                    {
                      contractAddress: permission['contractAddress'],
                      userAddress: permission['userAddress'],
                      recordType: permission['recordType'],
                      status: permission['status']
                    });
                }
              } else {
                this.infoToUpdate.approved[permission['contractAddress']] = {
                  admin: permission['status'].toLowerCase().indexOf('admin') !== -1,
                  read: permission['status'].toLowerCase().indexOf('read') !== -1,
                  write: permission['status'].toLowerCase().indexOf('write') !== -1
                };
                this.permissionsInfo.push(
                  {
                    contractAddress: permission['contractAddress'],
                    userAddress: permission['userAddress'],
                    recordType: permission['recordType'],
                    status: permission['status']
                  });
              }
            });
          });
        }
      }
    });
  }

  getLastEventOnContract(schoolAddress: string, contractAddress: string): string {
    if (isNullOrUndefined(this.latestInfo[schoolAddress])) {
      this.latestInfo[schoolAddress] = true;
      this.authService.getLatestLogsOnContract(this.user['accounts'][0], this.user['token'],
        schoolAddress, contractAddress).subscribe(response => {
        if (!isNullOrUndefined(response) && !isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['event'])) {
          this.latestInfo[schoolAddress] = moment.unix(JSON.parse(response['data']['event'])['timestamp']).format("DD MMM YYYY hh:mm A");
        }
      });
    }
    return this.latestInfo[schoolAddress] === true ? '' : ('Last activity on: ' + this.latestInfo[schoolAddress]);
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

  updatePermissions(blockchainAddress: string, contractAddress: string, pending: boolean) {
    if (!isNullOrUndefined(blockchainAddress) && !isNullOrUndefined(contractAddress)) {
      const data = {
        schoolAddress: blockchainAddress,
        contractAddress: contractAddress,
        admin: pending ? this.infoToUpdate.pending[contractAddress]['admin'] : this.infoToUpdate.approved[contractAddress]['admin'],
        write: pending ? this.infoToUpdate.pending[contractAddress]['write'] : this.infoToUpdate.approved[contractAddress]['write'],
        read: pending ? this.infoToUpdate.pending[contractAddress]['read'] : this.infoToUpdate.approved[contractAddress]['read']
      };
      this.authService.grantPermissions(this.user['accounts'][0], this.user['token'], data).subscribe(response => {
        console.log("permissions response : : ", response);
        if (!isNullOrUndefined(response) && !isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['message'])) {
          this.successMessage = response['data']['code'] === 200 ? response['data']['message'] : '';
          this.errorMessage = response['data']['code'] !== 200 ? response['data']['message'] : '';
          const parent = this;
          setTimeout(function () {
            parent.errorMessage = undefined;
            parent.successMessage = undefined;
          }, 300000);
        }
      });
    }
  }

  grantAll(blockchainAddress: string) {
    console.log(this.approveAllCandidates, blockchainAddress);
    if (!isNullOrUndefined(blockchainAddress)) {
      const data = [];
      for (const recordType in this.approveAllCandidates) {
        if (this.approveAllCandidates.hasOwnProperty(recordType)) {
          data.push({
            schoolAddress: blockchainAddress,
            admin: this.approveAllCandidates[recordType].admin,
            write: this.approveAllCandidates[recordType].write,
            read: this.approveAllCandidates[recordType].read,
            recordType: recordType
          });
        }
      }

      this.authService.grantAllPermissions(this.user['accounts'][0], this.user['token'], data).subscribe(response => {
        console.log("permissions response : : ", response);
        this.loading = true;
        if (!isNullOrUndefined(response) && !isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['message'])) {
          this.successMessage = response['data']['code'] === 200 ? response['data']['message'] : '';
          this.errorMessage = response['data']['code'] !== 200 ? response['data']['message'] : '';
          this.loading = false;
          const parent = this;
          setTimeout(function () {
            parent.errorMessage = undefined;
            parent.successMessage = undefined;
          }, 300000);
        }
      });
    }
  }
}
