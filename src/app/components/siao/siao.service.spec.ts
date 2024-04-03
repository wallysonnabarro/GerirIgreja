import { TestBed } from '@angular/core/testing';

import { SiaoService } from './siao.service';

describe('SiaoService', () => {
  let service: SiaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
