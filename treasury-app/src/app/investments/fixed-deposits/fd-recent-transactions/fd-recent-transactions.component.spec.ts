import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdRecentTransactionsComponent } from './fd-recent-transactions.component';

describe('FdRecentTransactionsComponent', () => {
  let component: FdRecentTransactionsComponent;
  let fixture: ComponentFixture<FdRecentTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdRecentTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdRecentTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
