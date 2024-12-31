import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyFixedDepositComponent } from './buy-fixed-deposit.component';

describe('BuyFixedDepositComponent', () => {
  let component: BuyFixedDepositComponent;
  let fixture: ComponentFixture<BuyFixedDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyFixedDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyFixedDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
