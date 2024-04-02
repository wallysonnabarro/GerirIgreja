import { TestBed } from '@angular/core/testing';

import { TribosService } from './tribos.service';

describe('TribosService', () => {
  let service: TribosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TribosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
