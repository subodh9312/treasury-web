import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxApplicabilityComponent } from './add-tax-applicability.component';

describe('AddTaxApplicabilityComponent', () => {
  let component: AddTaxApplicabilityComponent;
  let fixture: ComponentFixture<AddTaxApplicabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaxApplicabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxApplicabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
