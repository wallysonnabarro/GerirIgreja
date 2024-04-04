import { TestBed } from '@angular/core/testing';

import { FichaConectadoService } from './ficha-conectado.service';

describe('FichaConectadoService', () => {
  let service: FichaConectadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichaConectadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
