import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicepdfComponent } from './invoicepdf.component';

describe('InvoicepdfComponent', () => {
  let component: InvoicepdfComponent;
  let fixture: ComponentFixture<InvoicepdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoicepdfComponent]
    });
    fixture = TestBed.createComponent(InvoicepdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
