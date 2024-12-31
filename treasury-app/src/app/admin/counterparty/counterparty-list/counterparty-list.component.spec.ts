import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpartyListComponent } from './counterparty-list.component';

describe('CounterpartyListComponent', () => {
  let component: CounterpartyListComponent;
  let fixture: ComponentFixture<CounterpartyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterpartyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
