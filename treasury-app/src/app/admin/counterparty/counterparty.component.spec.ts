import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpartyComponent } from './counterparty.component';

describe('CounterpartyComponent', () => {
  let component: CounterpartyComponent;
  let fixture: ComponentFixture<CounterpartyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterpartyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
