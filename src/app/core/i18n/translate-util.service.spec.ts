import { TestBed, inject } from '@angular/core/testing';

import { TranslateUtilService } from './translate-util.service';

describe('TranslateUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateUtilService]
    });
  });

  it('should be created', inject([TranslateUtilService], (service: TranslateUtilService) => {
    expect(service).toBeTruthy();
  }));
});
