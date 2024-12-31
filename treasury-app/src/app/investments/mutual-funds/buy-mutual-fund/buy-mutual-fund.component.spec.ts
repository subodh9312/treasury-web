import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyMutualFundComponent } from './buy-mutual-fund.component';

describe('AddMutualFundComponent', () => {
  let component: BuyMutualFundComponent;
  let fixture: ComponentFixture<BuyMutualFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyMutualFundComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyMutualFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
