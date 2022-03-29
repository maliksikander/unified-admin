import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { DatabaseComponent } from "./database.component";

describe("DatabaseComponent", () => {
  let component: DatabaseComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new DatabaseComponent(
      snackbarService,
      fb,
      commonService,
      endPointService,
      cd
    );
  });

  it("should create database component", () => {
    expect(component).toBeTruthy();
  });
});
