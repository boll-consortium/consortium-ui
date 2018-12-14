import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {RegistrarContractService} from '../../services/contract/registrar-contract.service';
import Config from '../../../../config.json';

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
  registrarAddress: string = '0xebd3273c2f829181019e4a62e16f2ad548caac7e';
  Wb3: any;

  constructor(private registrarContractService: RegistrarContractService) {
  }

  ngOnInit() {
    this.creator_address = '0xa56ca4611087653cc6be31faa0911df2dfe951ec';
    this.gas = 2100000;
    if (typeof this.Wb3 !== 'undefined') {
      this.Wb3 = new Web3(Web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.Wb3 = new Web3(new Web3.providers.HttpProvider(Config['base_nodes'][0]));
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
