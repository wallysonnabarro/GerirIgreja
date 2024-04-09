import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizarDialogComponent } from './atualizar-dialog.component';

describe('AtualizarDialogComponent', () => {
  let component: AtualizarDialogComponent;
  let fixture: ComponentFixture<AtualizarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtualizarDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtualizarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
