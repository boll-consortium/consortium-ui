import { TestBed, inject } from '@angular/core/testing';

import { AuthCryptoService } from './auth-crypto.service';

describe('AuthCryptoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthCryptoService]
    });
  });

  it('should be created', inject([AuthCryptoService], (service: AuthCryptoService) => {
    expect(service).toBeTruthy();
  }));
});
