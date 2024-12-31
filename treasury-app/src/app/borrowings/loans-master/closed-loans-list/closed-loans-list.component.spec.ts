import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedLoansListComponent } from './closed-loans-list.component';

describe('ClosedLoansListComponent', () => {
  let component: ClosedLoansListComponent;
  let fixture: ComponentFixture<ClosedLoansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedLoansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedLoansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
