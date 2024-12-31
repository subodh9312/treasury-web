import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseLoanComponent } from './close-loan.component';

describe('CloseLoanComponent', () => {
  let component: CloseLoanComponent;
  let fixture: ComponentFixture<CloseLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
