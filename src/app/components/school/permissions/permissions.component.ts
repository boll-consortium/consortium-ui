import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {DbService} from '../../../services/db.service';
import {SessionStateService} from "../../../services/global/session-state.service";
import {IndexContractService} from "../../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../../services/contract/registrar-contract.service";
import StatementSpecs from "../../../../../src/record_type.json";
import {SelectOption} from "../../../models/SelectOption";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-school-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit, AfterViewInit {
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

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute) {
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
    this.user = this.sessionStateService.getUser();
    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      console.log("loading index contract");
      this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
    }
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
        this.loadLearningRecords('provider', [this.selectedSchoolAddress]);
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
    this.indexContractService.getRawLearningRecord(recordAddress, this.rawInfos.length, parseInt(recordSize, 10)).subscribe(response => {
      console.log("W::: ", response);
      response.forEach((record, index) => {
        record['contractAddress'] = recordAddress;
        this.rawInfos.push(record);
        // this.getPermissionRequests(record);
        this.getPermissions(record, this.rawProviders, false);
        this.getPermissions(record, this.rawProviders, true);
      });
    }, error => {
      console.log(error);
    });
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
            if (isPending) {
              this.pendingPermissionsInfo.push(
                {
                  contractAddress: permission['contractAddress'],
                  userAddress: permission['userAddress'],
                  recordType: permission['recordType'],
                  status: permission['status']
                });
            } else {
              this.permissionsInfo.push(
                {
                  contractAddress: permission['contractAddress'],
                  userAddress: permission['userAddress'],
                  recordType: permission['recordType'],
                  status: permission['status']
                });
            }
          });
        }
      }
    });
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
