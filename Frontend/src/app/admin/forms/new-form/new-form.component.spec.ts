import { ChangeDetectorRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { EndpointService } from "../../services/endpoint.service";
import { NewFormComponent } from "./new-form.component";

describe("NewFormComponent", () => {
  let component: NewFormComponent;
  let endPointService: any;
  let snackbarService: any;
  let commonService: any;
  let fb: FormBuilder;
  let cd: ChangeDetectorRef;

  beforeEach(() => {
    component = new NewFormComponent(
      commonService,
      fb,
      snackbarService,
      cd,
      endPointService
    );
  });

  it("should create new form component", () => {
    expect(component).toBeTruthy();
  });
});
