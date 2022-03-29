import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { LocaleComponent } from "./locale.component";

describe("LocaleComponent", () => {
  let component: LocaleComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new LocaleComponent(
      snackbarService,
      commonService,
      fb,
      endPointService,
      cd
    );
  });

  it("should create locale component", () => {
    expect(component).toBeTruthy();
  });
});
