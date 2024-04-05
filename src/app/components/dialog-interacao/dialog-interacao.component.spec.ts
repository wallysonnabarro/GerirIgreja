import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInteracaoComponent } from './dialog-interacao.component';

describe('DialogInteracaoComponent', () => {
  let component: DialogInteracaoComponent;
  let fixture: ComponentFixture<DialogInteracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogInteracaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInteracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
