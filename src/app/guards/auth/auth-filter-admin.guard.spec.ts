import { TestBed, async, inject } from '@angular/core/testing';

import { AuthFilterAdminGuard } from './auth-filter-admin.guard';

describe('AuthFilterAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFilterAdminGuard]
    });
  });

  it('should ...', inject([AuthFilterAdminGuard], (guard: AuthFilterAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
