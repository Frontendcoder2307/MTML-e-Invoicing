import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineinvoiceComponent } from './offlineinvoice.component';

describe('OfflineinvoiceComponent', () => {
  let component: OfflineinvoiceComponent;
  let fixture: ComponentFixture<OfflineinvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfflineinvoiceComponent]
    });
    fixture = TestBed.createComponent(OfflineinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
