import { TestBed } from '@angular/core/testing';

import { ProvedormenuService } from './provedormenu.service';

describe('ProvedormenuService', () => {
  let service: ProvedormenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvedormenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
