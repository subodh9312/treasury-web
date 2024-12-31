import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansMasterComponent } from './loans-master.component';

describe('LoansMasterComponent', () => {
  let component: LoansMasterComponent;
  let fixture: ComponentFixture<LoansMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
