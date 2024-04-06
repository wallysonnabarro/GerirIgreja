import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransferirComponent } from './dialog-transferir.component';

describe('DialogTransferirComponent', () => {
  let component: DialogTransferirComponent;
  let fixture: ComponentFixture<DialogTransferirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogTransferirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogTransferirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
