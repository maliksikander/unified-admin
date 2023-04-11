import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { WebWidgetFormComponent } from "./web-widget-form.component";

describe("WebWidgetFormComponent", () => {
  let component: WebWidgetFormComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let changeDetector: any

  beforeEach(() => {
    component = new WebWidgetFormComponent(
      commonService,
      fb,
      endPointService,
      snackbarService,
      changeDetector
    );
  });

  it("should create web widget form component", () => {
    expect(component).toBeTruthy();
  });
});
