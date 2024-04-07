import { TestBed } from '@angular/core/testing';

import { TokenDialogService } from './token-dialog.service';

describe('TokenDialogService', () => {
  let service: TokenDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
