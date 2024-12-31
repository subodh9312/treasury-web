import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxApplicabilityListComponent } from './tax-applicability-list.component';

describe('TaxApplicabilityListComponent', () => {
  let component: TaxApplicabilityListComponent;
  let fixture: ComponentFixture<TaxApplicabilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxApplicabilityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxApplicabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
