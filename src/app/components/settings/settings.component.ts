import {Component, OnInit} from '@angular/core';
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
  public updateData = {};
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
        if (isNullOrUndefined(fileReader.result)) {
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
              keyFile: fileReader.result
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
      };
      fileReader.readAsText(this.keyFile);
    }
  }

  updateInstituteInfo(self_update: boolean, blockchain_address: string) {
    this.errorMessage = null;

    if (!isNullOrUndefined(this.updateData[blockchain_address])) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log(fileReader.result);
        if (isNullOrUndefined(fileReader.result)) {
          this.errorMessage = "Key file is required";
        } else if (isNullOrUndefined(this.updateData[blockchain_address]['contactEmail']) ||
          isNullOrUndefined(this.updateData[blockchain_address]['name']) ||
          isNullOrUndefined(this.updateData[blockchain_address]['websiteAddress'])) {
          this.errorMessage = 'Please make sure the email address, school name and website address are provided.';
        } else {
          this.loading = true;
          console.log(this.keyFile, "That was the logo file!");
          const data = this.updateData[blockchain_address];
          data['logo'] = fileReader.result;
          data['picture_file'] = undefined;

          this.settingsService.updateInstituteInfo(data, this.user['accounts'][0], this.user['token']).subscribe(response => {
            console.log(response);
            if (response['data']['code'] === 200) {
              this.successMessage = 'Institute successfully updated.';
            } else {
              this.errorMessage = 'An error occurred while updating institute.';
            }
            this.loading = false;
          });
        }
      };
      fileReader.readAsDataURL(this.updateData[blockchain_address]['picture_file']);
    }
  }

  fileChange(e, isPicture: boolean, bollAddress: string) {
    if (!isPicture) {
      this.keyFile = e.target.files[0];
    } else {
      this.updateData[bollAddress]['picture_file'] = e.target.files[0];
    }
  }


}
