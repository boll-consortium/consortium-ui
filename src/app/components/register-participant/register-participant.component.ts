import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {RegistrarContractService} from '../../services/contract/registrar-contract.service';
import {publish} from 'rxjs/operator/publish';

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

  constructor(private registrarContractService: RegistrarContractService) {
  }

  ngOnInit() {
    this.creator_address = '0xe715f10de7cfcca2eb155ef87eea8c832bffcd78';
    this.gas = 2100000;
  }

  closeForm() {
    this.showForm.emit(false);
  }

  registerParticipant() {
    this.registrarContractService.createIndexContract(
      this.creator_address,
      this.gas, this.public_address,
      this.type === 'Learner' ? false : true).subscribe( (response) => {
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
