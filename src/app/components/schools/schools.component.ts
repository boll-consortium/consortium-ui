import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {DbService} from "../../services/db.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {SessionStateService} from "../../services/global/session-state.service";
import {SelectOption} from "../../models/SelectOption";
import StatementSpecs from "../../../../src/record_type.json";
import {AuthServerService} from "../../services/auth/auth-server.service";
import {isNullOrUndefined} from "util";
import * as moment from 'moment';
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit, AfterViewInit {
  public mainTitle = 'Schools';
  public subTitle = 'My Schools';
  showAddForm: boolean;
  public noAccount: boolean;
  public user: any;
  public providerAddress: string;
  public recordType: string;
  public recordTypesList: Array<SelectOption>;
  public providers: Array<SelectOption>;
  private rawProviders = [];
  public providerData = [];
  public learningRecords = [];
  public schools: any;
  private indexContractAddress: string;
  public recordInfos = {};
  public rawInfos = [];
  public message: any;
  public showMessage: boolean;
  errorMessage: string;
  successMessage: string;
  loading: boolean;
  public currentView = "home";
  private latestInfo = {};
  public selectedSchoolAddress: string;
  public approveAllCandidates = [];
  public statements: any;
  public currentSchool: any;
  private hostingProviderAddress: string;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private authService: AuthServerService,
              private route: ActivatedRoute,
              private router: Router, private meta: Meta) {
    this.statements = StatementSpecs;
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      if (params['view'] !== null && params['view'] !== undefined) {
        console.log(this.currentView);
        this.currentView = params['view'];
        console.log(this.currentView);
      }else {
        console.log(this.route.snapshot.params['view']);
      }
    });
    this.hostingProviderAddress = this.meta.getTag('name= "hostingProviderAddress"')
    !== null ? this.meta.getTag('name= "hostingProviderAddress"')
      .getAttribute("content") : null;
    this.recordTypesList = new Array<SelectOption>();
    StatementSpecs[0].actions.forEach((value, index) => {
      this.recordTypesList.push(new SelectOption(value['value'], value['label'], 1));
      this.approveAllCandidates[value['value']] = {admin: true, write: true, read: true};
    });
  }

  ngOnInit() {
    /*this.indexContractService.createRecordTest().subscribe(res => {
      console.log("SSSSSSSSSSSS", res);
    }, error2 => {
      console.log("Error:::::", error2);
    });*/
    this.user = this.sessionStateService.getUser();

    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      this.registrarService.isLearningProvider(this.user['accounts'][0]).subscribe(response => {
        if (!response) {
          this.dbService.getSchools(this.user['accounts'][0], this.user['token']).subscribe(responsel => {
            console.log(responsel);
            this.schools = responsel.data['schools'];
            const grantLink: HTMLElement = document.getElementById("grantAllInit") as HTMLElement;
            if (!isNullOrUndefined(this.hostingProviderAddress) && (isNullOrUndefined(this.schools) ||
                this.schools.some((school) => school.blockchainAddress === this.hostingProviderAddress))) {
              this.currentSchool = this.sessionStateService.getSchool(this.hostingProviderAddress);

              if (isNullOrUndefined(this.currentSchool)) {
                this.dbService.getSchool(this.user['accounts'][0], this.user['token'], this.hostingProviderAddress).subscribe(response => {
                  console.log("This school is ::: ", response);
                  if (!isNullOrUndefined(response.data['school'])) {
                    this.currentSchool = JSON.parse(response.data['school']);
                  }

                  if (!isNullOrUndefined(this.currentSchool)) {
                    grantLink.click();
                  }
                });
              } else {
                grantLink.click();
              }
            }
          });
        } else {
          console.log('not a learner');
          this.router.navigateByUrl('/learners');
        }
      });
    }
  }

  ngAfterViewInit(): void {
  }

  loadLearningProviders(indexContractAddress, ownerAddress) {
    this.indexContractService.getMyLearningProviders(indexContractAddress, ownerAddress).subscribe(response => {
      this.rawProviders = response;
      console.log("providers ", response);
      this.loadLearningRecords('provider', this.rawProviders);
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
            this.providerData.push({address: providerAddress, records: records});
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

  loadIndexContractAddress(ownerAddress) {
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
        console.log(response, "no index contract", ownerAddress);
      }
    });
    this.registrarService.getIndexContract("0xd3802a8fd3ed7f22260069025c7acde1e7ab027a").subscribe(response => {
      if (response && response !== "0x0000000000000000000000000000000000000000") {
        // this.indexContractAddress = response;
        console.log("Userkkk is:::", ownerAddress, "Index Contract:::", response);
        /*this.indexContractService.insertRecordTest(this.indexContractAddress, "").subscribe(response2 => {
          console.log("CCCCCCCCCCCC" + response2);
        }, error2 => {
          console.log("Error:::::" + error2);
        });*/
        this.loadLearningProviders(response, this.sessionStateService.getUser()['accounts'][0]);
      } else {
        console.log(response, "kkkno index contract", ownerAddress);
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
        this.rawInfos.push(record);
      });
    }, error => {
      console.log(error);
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

  getLastEvent(schoolAddress: string): string {
    if (isNullOrUndefined(this.latestInfo[schoolAddress])) {
      this.latestInfo[schoolAddress] = true;
      this.authService.getLatestLogs(this.user['accounts'][0], this.user['token'], schoolAddress).subscribe(response => {
        if (!isNullOrUndefined(response) && !isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['event']
          && response['data']['event'] !== 'null')) {
          this.latestInfo[schoolAddress] = moment.unix(JSON.parse(response['data']['event'])['timestamp']).format("DD MMM YYYY hh:mm A");
          const school = this.sessionStateService.getSchool(schoolAddress);
          if (!isNullOrUndefined(school)) {
            school['lastEvent'] = this.latestInfo[schoolAddress];
            this.sessionStateService.addSchool(school);
          }
        }
      });
    }
    return this.latestInfo[schoolAddress] === true ? '' : ('Last wrote records for you on: ' + this.latestInfo[schoolAddress]);
  }

  selectSchool(schoolAddress: string): void {
    this.selectedSchoolAddress = schoolAddress;
    this.router.navigate(['/school/' + schoolAddress]);
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
