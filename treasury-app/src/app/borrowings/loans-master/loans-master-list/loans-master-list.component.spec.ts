import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansMasterListComponent } from './loans-master-list.component';

describe('LoansMasterListComponent', () => {
  let component: LoansMasterListComponent;
  let fixture: ComponentFixture<LoansMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoansMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
