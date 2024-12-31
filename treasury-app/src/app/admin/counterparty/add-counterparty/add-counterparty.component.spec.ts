import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCounterpartyComponent } from './add-counterparty.component';

describe('AddCounterpartyComponent', () => {
  let component: AddCounterpartyComponent;
  let fixture: ComponentFixture<AddCounterpartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCounterpartyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCounterpartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
