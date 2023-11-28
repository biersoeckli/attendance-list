import { TestBed } from '@angular/core/testing';

import { AntraegeService } from './antraege.service';

describe('AntraegeService', () => {
  let service: AntraegeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntraegeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
