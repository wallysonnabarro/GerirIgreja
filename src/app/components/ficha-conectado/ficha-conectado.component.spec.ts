import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaConectadoComponent } from './ficha-conectado.component';

describe('FichaConectadoComponent', () => {
  let component: FichaConectadoComponent;
  let fixture: ComponentFixture<FichaConectadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FichaConectadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichaConectadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
