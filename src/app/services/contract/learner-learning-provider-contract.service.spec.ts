import { TestBed, inject } from '@angular/core/testing';

import { LearnerLearningProviderContractService } from './learner-learning-provider-contract.service';

describe('LearnerLearningProviderContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LearnerLearningProviderContractService]
    });
  });

  it('should be created', inject([LearnerLearningProviderContractService], (service: LearnerLearningProviderContractService) => {
    expect(service).toBeTruthy();
  }));
});
