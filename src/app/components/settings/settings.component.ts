import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SessionStateService} from "../../services/global/session-state.service";
import {RegistrarContractService} from "../../services/contract/registrar-contract.service";
import {DbService} from "../../services/db.service";
import {IndexContractService} from "../../services/contract/index-contract.service";
import {isNullOrUndefined} from "util";
import {SettingsService} from "../../services/settings/settings.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public mainTitle = 'Settings';
  public subTitle = 'App Settings';
  public errorMessage: string;
  public successMessage: string;
  public institutes: any;
  public approvalLists: {[k: string]: any} = {};
  public loading: boolean;
  public user: any;
  public keyFile: any;
  public password: string;

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private settingsService: SettingsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.sessionStateService.getUser();
    this.settingsService.getAllInstitutes(this.user['accounts'][0], this.user['token']).subscribe(response => {
      console.log(response);
      if (response['data']['bollInstitutes']['code'] === 200) {
        this.institutes = response['data']['bollInstitutes']['institutes'];
      }else {
      }
    });
  }

  isApproved(blockchainAddress: string, accessToken: string, force = false) {
    if (isNullOrUndefined(accessToken)) {
      this.approvalLists[blockchainAddress] = false;
      return this.approvalLists[blockchainAddress];
    }
    if (force || isNullOrUndefined(this.approvalLists[blockchainAddress])) {
      this.registrarService.isApproved(blockchainAddress, accessToken).subscribe(approved => {
        this.approvalLists[blockchainAddress] = approved;
        return this.approvalLists[blockchainAddress];
      });
    } else {
      return this.approvalLists[blockchainAddress];
    }
  }

  approveRegistration(blockchainAddress: string, accessToken: string, index: number) {
    if (!isNullOrUndefined(blockchainAddress) || !this.isApproved(blockchainAddress, accessToken)) {
      this.loading = true;
      this.settingsService.approveRegistration(blockchainAddress, this.user['accounts'][0],
        this.user['token']).subscribe(response => {
        console.log(response);
        this.loading = false;
        if (response['data']['code'] === 200) {
          this.isApproved(blockchainAddress, response['data']['accessToken'], true);
          this.institutes[index]['accessToken'] = response['data']['accessToken'];
        }else {
        }
      });
    }
  }

  updateCredentials(self_update: boolean, blockchain_address: string, contact_email: string) {
    this.errorMessage = null;

    if (!isNullOrUndefined(this.keyFile)) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log(fileReader.result);
      };
      fileReader.readAsText(this.keyFile);
    }
    if (isNullOrUndefined(this.keyFile)) {
      this.errorMessage = "Key file is required";
    } else if (isNullOrUndefined(this.password) || this.password.trim().length === 0) {
      this.errorMessage = 'password is required';
    } else {
      this.loading = true;
      console.log(this.keyFile, "That was the key file!");
      const data = {
        username: blockchain_address,
        emailAddress: contact_email,
        bollUser: {
          bollAddress: blockchain_address,
          password: this.password,
          keyFile: this.keyFile
        }
      };

      this.settingsService.uploadCredentials(data, this.user['accounts'][0], this.user['token']).subscribe(response => {
        console.log(response);
        if (response['data']['code'] === 200) {
          this.successMessage = 'Credentials successfully uploaded.';
        } else {
          this.errorMessage = 'An error occurred while uploading credentials.';
        }
        this.loading = false;
      });
    }
  }

  fileChange(e) {
    this.keyFile = e.target.files[0];
  }


}
