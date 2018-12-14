import { Injectable } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IndexContractService} from "../contract/index-contract.service";
import {DbService} from "../db.service";
import {RegistrarContractService} from "../contract/registrar-contract.service";
import {SessionStateService} from "../global/session-state.service";

@Injectable()
export class BollServicesService {

  constructor(private dbService: DbService,
              private sessionStateService: SessionStateService,
              private indexContractService: IndexContractService,
              private registrarService: RegistrarContractService,
              private route: ActivatedRoute) { }

}
