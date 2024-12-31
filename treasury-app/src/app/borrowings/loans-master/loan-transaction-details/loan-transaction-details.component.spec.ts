import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTransactionDetailsComponent } from './loan-transaction-details.component';

describe('LoanTransactionDetailsComponent', () => {
  let component: LoanTransactionDetailsComponent;
  let fixture: ComponentFixture<LoanTransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanTransactionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
