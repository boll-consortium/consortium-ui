import { TestBed, inject } from '@angular/core/testing';

import { AuthServerService } from './auth-server.service';

describe('AuthServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthServerService]
    });
  });

  it('should be created', inject([AuthServerService], (service: AuthServerService) => {
    expect(service).toBeTruthy();
  }));
});
