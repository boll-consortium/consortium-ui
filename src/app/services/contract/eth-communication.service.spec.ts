import { TestBed, inject } from '@angular/core/testing';

import { EthCommunicationService } from './eth-communication.service';

describe('EthCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthCommunicationService]
    });
  });

  it('should be created', inject([EthCommunicationService], (service: EthCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
