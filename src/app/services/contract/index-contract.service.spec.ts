import { TestBed, inject } from '@angular/core/testing';

import { IndexContractService } from './index-contract.service';

describe('IndexContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexContractService]
    });
  });

  it('should be created', inject([IndexContractService], (service: IndexContractService) => {
    expect(service).toBeTruthy();
  }));
});
