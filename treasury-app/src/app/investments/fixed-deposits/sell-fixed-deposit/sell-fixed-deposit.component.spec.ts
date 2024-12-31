import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellFixedDepositComponent } from './sell-fixed-deposit.component';

describe('SellFixedDepositComponent', () => {
  let component: SellFixedDepositComponent;
  let fixture: ComponentFixture<SellFixedDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellFixedDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellFixedDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
