import { TestBed, inject } from '@angular/core/testing';

import { RegistrarContractService } from './registrar-contract.service';

describe('RegistrarContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistrarContractService]
    });
  });

  it('should be created', inject([RegistrarContractService], (service: RegistrarContractService) => {
    expect(service).toBeTruthy();
  }));
});
