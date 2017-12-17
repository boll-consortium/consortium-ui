import { Component, OnInit } from '@angular/core';
import {Route, ActivatedRoute, Params} from '@angular/router';
import {IndexContractService} from '../../services/contract/index-contract.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  myAccessibleContracts: any[];
  myIndexContract: string;
  myEthAddress: string;

  constructor(private indexContractService: IndexContractService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.myEthAddress = params['ethAddress'];
      this.myIndexContract = params['indexContract'];
      this.loadAccessibleContracts();
    });
  }

  loadAccessibleContracts() {
    /*this.indexContractService.getAllAccessibleData(this.myIndexContract, this.myEthAddress).subscribe(response => {
      console.log(response);
      this.myAccessibleContracts = response.data;
    });*/
  }

}
