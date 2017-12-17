import { TestBed, inject } from '@angular/core/testing';

import { AuthCredentialsService } from './auth-credentials.service';

describe('AuthCredentialsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthCredentialsService]
    });
  });

  it('should be created', inject([AuthCredentialsService], (service: AuthCredentialsService) => {
    expect(service).toBeTruthy();
  }));
});
