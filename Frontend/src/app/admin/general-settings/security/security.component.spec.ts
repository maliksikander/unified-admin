import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { SecurityComponent } from "./security.component";

describe("SecurityComponent", () => {
  let component: SecurityComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new SecurityComponent(
      snackbarService,
      fb,
      commonService,
      endPointService,
      cd
    );
  });

  it("should create security component", () => {
    expect(component).toBeTruthy();
  });
});
