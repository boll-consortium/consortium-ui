import { TestBed, inject } from '@angular/core/testing';

import { SessionStateService } from './session-state.service';

describe('SessionStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStateService]
    });
  });

  it('should be created', inject([SessionStateService], (service: SessionStateService) => {
    expect(service).toBeTruthy();
  }));
});
