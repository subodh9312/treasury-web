import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellMutualFundComponent } from './sell-mutual-fund.component';

describe('SellMutualFundComponent', () => {
  let component: SellMutualFundComponent;
  let fixture: ComponentFixture<SellMutualFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellMutualFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellMutualFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
