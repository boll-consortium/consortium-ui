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
  public currentView = "home";
  private latestInfo = {};
  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private authService: AuthServerService,
              private route: ActivatedRoute,
              private router: Router) {
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

    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
      console.log("no account");
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      this.registrarService.isLearningProvider(this.user['accounts'][0]).subscribe(response => {
        if (!response) {
          this.dbService.getSchools(this.user['accounts'][0], this.user['token']).subscribe(responsel => {
            console.log(responsel);
            this.schools = responsel.data['schools'];
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
        if (!isNullOrUndefined(response) && !isNullOrUndefined(response['data']) && !isNullOrUndefined(response['data']['event'])) {
          console.log(response['data']['event']['timestamp'] * 1000, response['data']['event']['timestamp'], response);
          this.latestInfo[schoolAddress] = new Date((JSON.parse(response['data']['event'])['timestamp']) * 1000);
        }
      });
    }
    return this.latestInfo[schoolAddress] === true ? '' : ('Last wrote records for you on: ' + this.latestInfo[schoolAddress]);
  }
}
