import { TestBed, async, inject } from '@angular/core/testing';

import { AuthFilterGuard } from './auth-filter.guard';

describe('AuthFilterGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFilterGuard]
    });
  });

  it('should ...', inject([AuthFilterGuard], (guard: AuthFilterGuard) => {
    expect(guard).toBeTruthy();
  }));
});
