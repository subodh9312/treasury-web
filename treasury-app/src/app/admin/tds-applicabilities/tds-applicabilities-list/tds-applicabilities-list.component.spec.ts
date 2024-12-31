import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsApplicabilitiesListComponent } from './tds-applicabilities-list.component';

describe('TdsApplicabilitiesListComponent', () => {
  let component: TdsApplicabilitiesListComponent;
  let fixture: ComponentFixture<TdsApplicabilitiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsApplicabilitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsApplicabilitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
