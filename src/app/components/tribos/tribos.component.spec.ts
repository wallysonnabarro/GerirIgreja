import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribosComponent } from './tribos.component';

describe('TribosComponent', () => {
  let component: TribosComponent;
  let fixture: ComponentFixture<TribosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TribosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TribosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
