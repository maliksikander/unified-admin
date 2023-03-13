import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { AmqComponent } from "./amq.component";

describe("AmqComponent", () => {
  let component: AmqComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new AmqComponent(
      snackbarService,
      fb,
      commonService,
      endPointService,
      cd
    );
  });

  it("should create amq component", () => {
    expect(component).toBeTruthy();
  });
});
