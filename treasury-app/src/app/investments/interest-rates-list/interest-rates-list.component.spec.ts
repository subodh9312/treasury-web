import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestRatesListComponent } from './interest-rates-list.component';

describe('InterestRatesListComponent', () => {
  let component: InterestRatesListComponent;
  let fixture: ComponentFixture<InterestRatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestRatesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestRatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
