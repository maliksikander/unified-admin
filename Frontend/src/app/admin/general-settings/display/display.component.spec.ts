import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { DisplayComponent } from "./display.component";

describe("DisplayComponent", () => {
  let component: DisplayComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new DisplayComponent(
      snackbarService,
      fb,
      commonService,
      endPointService,
      cd
    );
  });

  it("should create display component", () => {
    expect(component).toBeTruthy();
  });
});
