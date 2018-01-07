import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {RegistrarContractService} from '../../services/contract/registrar-contract.service';

import Web3 from 'web3';
@Component({
  selector: 'app-register-participant',
  templateUrl: './register-participant.component.html',
  styleUrls: ['./register-participant.component.css']
})
export class RegisterParticipantComponent implements OnInit {
  @Output()
  showForm: EventEmitter<boolean> = new EventEmitter();
  public_address: string;
  other_id: string;
  type: string;
  status: string;
  gas: number;
  creator_address: string;
  registrarAddress: string = '0x35d18a934178cab1c2b8e7c747b2df4479708d40';
  Wb3: any;

  constructor(private registrarContractService: RegistrarContractService) {
  }

  ngOnInit() {
    this.creator_address = '0xe715f10de7cfcca2eb155ef87eea8c832bffcd78';
    this.gas = 2100000;
    if (typeof this.Wb3 !== 'undefined') {
      this.Wb3 = new Web3(Web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.Wb3 = new Web3(new Web3.providers.HttpProvider("http://10.236.173.83:6060/node1"));
    }
    console.log("sssaaaaaaaaaaa");
    console.log("WWWWWW::::: ", this.Wb3.eth.getTransactionReceipt("0x2b948e47e473788688a539fe1ee6f852689be438d15f0f42c787b0f9cd969328"));

  }

  closeForm() {
    this.showForm.emit(false);
  }

  registerParticipant() {
    this.registrarContractService.createIndexContract(
      this.creator_address,
      this.gas, this.public_address,
      this.type === 'Learner' ? false : true, this.status, this.registrarAddress, this.other_id).subscribe( (response) => {
        console.log('1::: ', response);
        this.registrarContractService.registerParticipant(
          this.creator_address,
          this.public_address, this.other_id,
          response.address,
          this.type === 'Learner' ? false : true, this.status ).subscribe(response2 => {
            console.log('2::: ', response2);
            this.closeForm();
        });
    });
  }

}
