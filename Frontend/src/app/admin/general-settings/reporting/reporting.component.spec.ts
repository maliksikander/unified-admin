import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { ReportingComponent } from "./reporting.component";

describe("ReportingComponent", () => {
  let component: ReportingComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new ReportingComponent(
      snackbarService,
      fb,
      commonService,
      endPointService,
      cd
    );
  });

  it("should create reporting component", () => {
    expect(component).toBeTruthy();
  });
});
