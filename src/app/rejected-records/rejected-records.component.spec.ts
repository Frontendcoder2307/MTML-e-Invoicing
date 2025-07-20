import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRecordsComponent } from './rejected-records.component';

describe('RejectedRecordsComponent', () => {
  let component: RejectedRecordsComponent;
  let fixture: ComponentFixture<RejectedRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectedRecordsComponent]
    });
    fixture = TestBed.createComponent(RejectedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
