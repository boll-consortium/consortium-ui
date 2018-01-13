import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DbService} from '../../services/db.service';
import {SessionStateService} from "../../services/global/session-state.service";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  showAddForm: boolean;
  registeredParticipants: [any];
  public noAccount: boolean;
  public user: any;
  public providerAddress: string;
  public recordType: string;
  public providers: any;
  public learningRecords: any;
  private indexContractAddress: string;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService) {
  }

  ngOnInit() {
    /*this.indexContractService.createRecordTest().subscribe(res => {
      console.log("SSSSSSSSSSSS", res);
    }, error2 => {
      console.log("Error:::::", error2);
    });*/
    this.dbService.getRegisteredNodes().subscribe(response => {
      console.log(response);
      this.registeredParticipants = response.data;
    });
    this.user = this.sessionStateService.getUser();
    if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'] === undefined) {
      this.noAccount = true;
    } else if (this.sessionStateService.getUser() !== null && this.sessionStateService.getUser()['accounts'].length > 0) {
      this.loadIndexContractAddress(this.sessionStateService.getUser()['accounts'][0], null);
    }
  }

  ngAfterViewInit(): void {
  }

  loadLearningProviders(indexContractAddress, ownerAddress) {
    this.indexContractService.getMyLearningProviders(indexContractAddress, ownerAddress).subscribe(response => {
      this.providers = response;
      this.providerAddress = this.providers[0];
      this.loadLearningRecords();
    });
  }

  loadLearningRecords() {
    if (this.providerAddress !== null && this.providerAddress !== undefined) {
      if (this.recordType === 'All' || this.recordType === undefined || this.recordType === null) {
        this.indexContractService.getRecordsByLearningProvider(this.indexContractAddress, this.providerAddress).subscribe(records => {
          this.learningRecords = records;
        });
      } else {
        this.indexContractService.getRecordsByProvidersAndRecordType(this.indexContractAddress,
          [this.providerAddress], this.recordType).subscribe(records => {
          this.learningRecords = records;
        });
      }
    }
  }

  loadIndexContractAddress(ownerAddress, registrarAddress) {
    this.registrarService.getIndexContract(ownerAddress, registrarAddress).subscribe(response => {
      if (response && response !== "0x0000000000000000000000000000000000000000") {
        this.indexContractAddress = response;
        console.log("User is:::", ownerAddress, "Index Contract:::", response);
        /*this.indexContractService.insertRecordTest(this.indexContractAddress, "").subscribe(response2 => {
          console.log("CCCCCCCCCCCC" + response2);
        }, error2 => {
          console.log("Error:::::" + error2);
        });*/
        this.loadLearningProviders(response, this.sessionStateService.getUser()['accounts'][0]);
      }
    });
  }

  setShowAddForm(show) {
    console.log('sssss', show);
    this.showAddForm = show;
  }

}
