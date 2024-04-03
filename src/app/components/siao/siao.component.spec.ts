import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiaoComponent } from './siao.component';

describe('SiaoComponent', () => {
  let component: SiaoComponent;
  let fixture: ComponentFixture<SiaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
