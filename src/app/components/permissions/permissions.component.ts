import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DbService} from '../../services/db.service';
import {SessionStateService} from "../../services/global/session-state.service";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import StatementSpecs from "../../../../src/record_type.json";
import {SelectOption} from "../../models/SelectOption";
import {ActivatedRoute, Params} from "@angular/router";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit, AfterViewInit {
  public mainTitle = 'Permissions';
  public subTitle = 'My Permissions';
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
  public selectedContractAddress: string;
  public selectedSchoolAddress: string;
  private schoolsChecked = {};
  public searchText: string;
  public preSearchText: string;
  public searchText_p: string;
  public preSearchText_p: string;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      let sender = 'school';
      if (!isNullOrUndefined(params['from'])) {
        sender = params['from'];
      }
      if (sender === 'school') {
        if (!isNullOrUndefined(params['contract_address'])) {
          this.selectedSchoolAddress = params['contract_address'];
        }
      } else {
        if (!isNullOrUndefined(params['contract_address'])) {
          this.selectedContractAddress = params['contract_address'];
        }
        if (!isNullOrUndefined(params['school_address'])) {
          this.selectedSchoolAddress = params['school_address'];
        }
      }
      if (params['view'] !== null && params['view'] !== undefined) {
        console.log(this.currentView);
        this.currentView = params['view'];
        console.log(this.currentView);
      }else {
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

  loadLearningProviders(indexContractAddress, ownerAddress) {
    this.indexContractService.getMyLearningProviders(indexContractAddress, ownerAddress).subscribe(response => {
      this.rawProviders = response;
      console.log("providers ", response);
      this.loadLearningRecords('provider', this.rawProviders);
      this.loadProviders(response);
    });
  }

  private loadProviders(response) {
    this.providers = new Array <SelectOption>();
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
    this.indexContractService.loadLearningRecordInfo(recordAddress).subscribe( response => {
      this.recordInfos[recordAddress] = response;
      console.log("XXXXXXXXVVVVV", this.recordInfos);
    }, error => {
      console.log(error);
    });
  }
  loadLearningRecordDeepInfo(recordAddress, recordSize) {
    this.indexContractService.getRawLearningRecord(recordAddress, this.rawInfos.length, parseInt(recordSize, 10)).subscribe( response => {
      console.log("W::: ", response);
      response.forEach((record, index) => {
        record['contractAddress'] = recordAddress;
        if (!isNullOrUndefined(this.selectedContractAddress)) {
          if (this.selectedContractAddress === record['contractAddress']) {
            this.rawInfos.push(record);
            // this.getPermissionRequests(record);
            this.getPermissions(record, this.rawProviders, false);
            this.getPermissions(record, this.rawProviders, true);
          }
        } else {
          this.rawInfos.push(record);
          // this.getPermissionRequests(record);
          this.getPermissions(record, this.rawProviders, false);
          this.getPermissions(record, this.rawProviders, true);
        }
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
            {contractAddress: record['contractAddress'],
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
              if (!isNullOrUndefined(permission['status']) && permission['status'] !== '') {
                this.pendingPermissionsInfo.push(
                  {
                    contractAddress: permission['contractAddress'],
                    userAddress: permission['userAddress'],
                    recordType: permission['recordType'],
                    status: permission['status']
                  });
              }
            } else {
              this.permissionsInfo.push(
                {contractAddress: permission['contractAddress'],
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
        (!isNullOrUndefined(school.logo) ? school.logo : 'assets/dist/img/school.png') + "'>\n" +
        "                <span class=''>" + school.name + "</span></div>";
      return schoolDesign;
    }
    return schoolAddress;
  }

  getSchoolDetails_Name(schoolAddress: string, pending = false): string {
    let school = this.sessionStateService.getSchool(schoolAddress);
    if (isNullOrUndefined(school)) {
      if (isNullOrUndefined(this.schoolsChecked[schoolAddress])) {
        this.schoolsChecked[schoolAddress] = true;
        this.dbService.getSchool(this.user['accounts'][0], this.user['token'], schoolAddress).subscribe(response => {
          school = this.sessionStateService.getSchool(schoolAddress);
        });
      }
    } else {
      // const highlightedSchool = HighlightTransformer.prototype.transform(school.name, pending ? this.searchText_p : this.searchText);
      const schoolDesign = "<div class='text-center'>\n" + school.name + "</div>";
      return schoolDesign;
    }
    // return schoolAddress;
  }

  filterBySearchText(pending = false) {
    if (!pending) {
      if (this.preSearchText !== this.searchText) {
        this.searchText = this.preSearchText;
      }
    } else {
      if (this.preSearchText_p !== this.searchText_p) {
        this.searchText_p = this.preSearchText_p;
      }
    }
  }
}
