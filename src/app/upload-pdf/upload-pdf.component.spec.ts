import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPDFComponent } from './upload-pdf.component';

describe('UploadPDFComponent', () => {
  let component: UploadPDFComponent;
  let fixture: ComponentFixture<UploadPDFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadPDFComponent]
    });
    fixture = TestBed.createComponent(UploadPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
