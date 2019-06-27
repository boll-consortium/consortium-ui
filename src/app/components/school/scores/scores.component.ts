import {Component, Input, NgZone, OnInit} from '@angular/core';
import {DbService} from "../../../services/db.service";
import {SessionStateService} from "../../../services/global/session-state.service";
import {IndexContractService} from "../../../services/contract/index-contract.service";
import {RegistrarContractService} from "../../../services/contract/registrar-contract.service";
import {ActivatedRoute, Params} from "@angular/router";
import {SettingsService} from "../../../services/settings/settings.service";
import {HttpInterceptorService} from "../../../services/http/http-interceptor.service";
import {SelectOption} from "../../../models/SelectOption";

@Component({
  selector: 'app-school-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {

  public mainTitle = 'Scores & Certs';
  public subTitle = 'My Scores & Certificates';
  showAddForm: boolean;
  public user: any;
  public providerAddress: string;
  public recordType: string;
  public providers: Array<SelectOption>;
  public learningRecords = [];
  public message: any;
  public showMessage: boolean;
  public currentView = "home";
  @Input()
  public selectedSchoolAddress: string;


  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute,
              private settingsService: SettingsService,
              private httpInterceptorService: HttpInterceptorService,
              private zone: NgZone) {
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
  }

}
