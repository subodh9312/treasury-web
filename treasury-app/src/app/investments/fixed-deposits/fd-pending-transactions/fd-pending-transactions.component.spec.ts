import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdPendingTransactionsComponent } from './fd-pending-transactions.component';

describe('FdPendingTransactionsComponent', () => {
  let component: FdPendingTransactionsComponent;
  let fixture: ComponentFixture<FdPendingTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdPendingTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdPendingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
