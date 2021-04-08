import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LicenseManagerComponent } from './license-manager.component';

describe('LicenseManagerComponent', () => {
  let component: LicenseManagerComponent;
  let fixture: ComponentFixture<LicenseManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
