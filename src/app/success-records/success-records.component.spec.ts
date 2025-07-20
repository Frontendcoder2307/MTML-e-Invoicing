import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessRecordsComponent } from './success-records.component';

describe('SuccessRecordsComponent', () => {
  let component: SuccessRecordsComponent;
  let fixture: ComponentFixture<SuccessRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuccessRecordsComponent]
    });
    fixture = TestBed.createComponent(SuccessRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
