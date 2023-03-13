import { LoginComponent } from "./login.component";
import { FormBuilder } from "@angular/forms";
import { EndpointService } from "../../admin/services/endpoint.service";

describe("LoginComponent", () => {
  let fixture: LoginComponent;
  let formBuilderMock: FormBuilder;
  let routerMock: any;
  let endPointService: EndpointService;
  let snackbarService: any;
  let commonService: any;

  beforeEach(() => {
    formBuilderMock = new FormBuilder();
    fixture = new LoginComponent(
      routerMock,
      endPointService,
      commonService,
      snackbarService,
      formBuilderMock
    );
  });

  it("should create login component", () => {
    expect(fixture).toBeTruthy();
  });

  describe("Test: Login Form", () => {
    it("should invalidate the form", () => {
      fixture.loginForm.controls.username.setValue("");
      fixture.loginForm.controls.password.setValue("");
      expect(fixture.loginForm.valid).toBeFalsy();
    });

    it("should validate the form", () => {
      fixture.loginForm.controls.username.setValue("demo");
      fixture.loginForm.controls.password.setValue("P@$$W0rd");
      expect(fixture.loginForm.valid).toBeTruthy();
    });
  });
});
