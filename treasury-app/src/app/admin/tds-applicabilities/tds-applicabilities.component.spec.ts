import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsApplicabilitiesComponent } from './tds-applicabilities.component';

describe('TdsApplicabilitiesComponent', () => {
  let component: TdsApplicabilitiesComponent;
  let fixture: ComponentFixture<TdsApplicabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsApplicabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsApplicabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
