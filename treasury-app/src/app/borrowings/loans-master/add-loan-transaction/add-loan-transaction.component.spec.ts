import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoanTransactionComponent } from './add-loan-transaction.component';

describe('AddLoanTransactionComponent', () => {
  let component: AddLoanTransactionComponent;
  let fixture: ComponentFixture<AddLoanTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoanTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
