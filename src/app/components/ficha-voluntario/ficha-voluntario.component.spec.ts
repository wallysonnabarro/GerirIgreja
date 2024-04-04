import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaVoluntarioComponent } from './ficha-voluntario.component';

describe('FichaVoluntarioComponent', () => {
  let component: FichaVoluntarioComponent;
  let fixture: ComponentFixture<FichaVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FichaVoluntarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichaVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
