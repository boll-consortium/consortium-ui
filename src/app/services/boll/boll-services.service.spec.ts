import { TestBed, inject } from '@angular/core/testing';

import { BollServicesService } from './boll-services.service';

describe('BollServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BollServicesService]
    });
  });

  it('should be created', inject([BollServicesService], (service: BollServicesService) => {
    expect(service).toBeTruthy();
  }));
});
