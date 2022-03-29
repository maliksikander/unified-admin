import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { ChannelTypeFormComponent } from "./channel-type-form.component";

describe("ChannelTypeFormComponent", () => {
  let component: ChannelTypeFormComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;

  beforeEach(() => {
    component = new ChannelTypeFormComponent(
      commonService,
      fb,
      snackbarService,
      endPointService
    );
  });

  it("should create channel type form component", () => {
    expect(component).toBeTruthy();
  });
});
