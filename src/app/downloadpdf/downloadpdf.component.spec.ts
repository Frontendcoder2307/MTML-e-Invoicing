import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadpdfComponent } from './downloadpdf.component';

describe('DownloadpdfComponent', () => {
  let component: DownloadpdfComponent;
  let fixture: ComponentFixture<DownloadpdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadpdfComponent]
    });
    fixture = TestBed.createComponent(DownloadpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
