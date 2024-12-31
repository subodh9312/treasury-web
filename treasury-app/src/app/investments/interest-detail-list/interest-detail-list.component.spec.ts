import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestDetailListComponent } from './interest-detail-list.component';

describe('InterestDetailListComponent', () => {
  let component: InterestDetailListComponent;
  let fixture: ComponentFixture<InterestDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
