import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTdsApplicabilityComponent } from './add-tds-applicability.component';

describe('AddTdsApplicabilityComponent', () => {
  let component: AddTdsApplicabilityComponent;
  let fixture: ComponentFixture<AddTdsApplicabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTdsApplicabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdsApplicabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
