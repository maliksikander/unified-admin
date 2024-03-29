import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

// import { EndpointService } from "src/app/admin/services/endpoint.service";
import { EndpointService } from "../../admin/services/endpoint.service";
import { CommonService } from "../../admin/services/common.service";
import { SnackbarService } from "../../admin/services/snackbar.service";
// import * as CryptoJS from "crypto-js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  forgotPassword = false;
  hide = true;
  loginForm: FormGroup;
  logoUrl = "assets/images/expertflow-logo.png";
  spinner = false;
  rememberMe: boolean = true;

  validationMessages = {
    username: {
      required: "This field is required",
      minlength: "More characters required",
      maxlength: "Max 40 characters allowed",
      pattern: 'Allowed special characters "[!@#$%^&*()-_=+~`"]+"',
    },
    password: {
      required: "This field is required",
      maxlength: "Max 256 characters allowed",
      pattern: 'Allowed special characters "[!@#$%^&*()-_=+~`"]+"',
    },
  };

  formErrors = {
    username: "",
    password: "",
  };

  constructor(
    private router: Router,
    private endPointService: EndpointService,
    private commonService: CommonService,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      rememberMe: [true],
    });
  }

  ngOnInit() {
    // this.loginForm = this.fb.group({
    //   username: ["", [Validators.required]],
    //   password: ["", [Validators.required]],
    //   rememberMe: [true],
    // });

    this.loginForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(
        this.loginForm,
        this.formErrors,
        this.validationMessages
      );
      this.formErrors = result[0];
      this.validationMessages = result[1];
    });
  }

  login() {
    this.spinner = true;
    let data = this.loginForm.value;
    let reqBody = JSON.parse(JSON.stringify(data));
    delete reqBody.rememberMe;
    // reqBody.username = CryptoJS.AES.encrypt(data.username, "undlusia").toString();
    // reqBody.password = CryptoJS.AES.encrypt(data.password, "undlusia").toString();
      this.endPointService.login(reqBody).subscribe(
        (res: any) => {
          this.storeValues(res, data);
          this.spinner = false;
        },
        (error: any) => {
          // this.snackbar.snackbarMessage(
          //   "error-snackbar",
          //   error.error,
          //   2
          // );
          this.spinner = false;
          console.error("Error fetching:", error);
        }
      );
  }  

  storeValues(res, data) {
    let resources: Array<any> = res.keycloak_User.permittedResources.Resources;
    if (data.rememberMe == true) {
      localStorage.setItem("username", res.keycloak_User.username);
      localStorage.setItem("tenant", res.keycloak_User.realm);
      localStorage.setItem("token", res.token);
    }
    sessionStorage.setItem("username", res.keycloak_User.username);
    sessionStorage.setItem("tenant", res.keycloak_User.realm);
    sessionStorage.setItem("token", res.token);
    localStorage.setItem("resources", JSON.stringify(resources));
    // sessionStorage.setItem("resources", JSON.stringify(resources));

    this.endPointService.token = res.token;
    this.navigateToResource(resources);
  }

  navigateToResource(resources: Array<any>) {
    try {
      // let item = resources[0];
      let routeCheck = false;
      resources.forEach((item) => {
        if (item.rsname === "general-settings") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/general/license-manager"]);
            }
          });
        } else if (item.rsname === "bot-settings") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/bot-settings"]);
            }
          });
        } else if (item.rsname === "forms") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/form"]);
            }
          });
        } else if (item.rsname === "reason-code") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/reason-code"]);
            }
          });
        } else if (item.rsname === "pull-mode-list") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/pull-mode-list"]);
            }
          });
        } else if (item.rsname === "web-widget") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/web-widget"]);
            }
          });
        } else if (item.rsname === "agent-desk-setting") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/agent-desk"]);
            }
          });
        } else if (item.rsname.includes("channel")) {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/channel/channel-type"]);
            }
          });
        } else if (item.rsname === "routing-attribute") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/routing/attributes"]);
            }
          });
        } else if (item.rsname === "mrd") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/routing/media-routing-domain"]);
            }
          });
        } else if (item.rsname === "agent-mrd") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/routing/mrd-tasks"]);
            }
          });
        } else if (item.rsname === "queue") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/routing/precision-queue"]);
            }
          });
        } else if (item.rsname === "agent-attributes") {
          let scopes: Array<any> = item?.scopes;
          scopes.forEach((scope: any) => {
            if (scope == "view") {
              routeCheck = true;
              this.router.navigate(["/routing/agents"]);
            }
          });
        }
        //  else if (item.rsname.includes("calendar")) {
        //   let scopes: Array<any> = item?.scopes;
        //   scopes.forEach((scope: any) => {
        //     if (scope == "view") {
        //       routeCheck = true;
        //       this.router.navigate(["/business-calendar"]);
        //     }
        //   });
        // }
        // else {
        //   this.snackbar.snackbarMessage(
        //     "error-snackbar",
        //     "Not Authorized to Access Resources",
        //     2
        //   );
        // }
      });
      if (routeCheck == false)
        this.snackbar.snackbarMessage(
          "error-snackbar",
          "Not Authorized to Access Resources",
          2
        );
    } catch (e) {
      console.log("[Navigation Error in Login] :", e);
    }
  }
}
