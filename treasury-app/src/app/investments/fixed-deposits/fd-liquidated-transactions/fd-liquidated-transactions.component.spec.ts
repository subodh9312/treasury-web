import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdLiquidatedTransactionsComponent } from './fd-liquidated-transactions.component';

describe('FdLiquidatedTransactionsComponent', () => {
  let component: FdLiquidatedTransactionsComponent;
  let fixture: ComponentFixture<FdLiquidatedTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdLiquidatedTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdLiquidatedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
