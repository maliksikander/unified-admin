import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/admin/services/common.service';
import { EndpointService } from 'src/app/admin/services/endpoint.service';
import { SnackbarService } from 'src/app/admin/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  forgotPassword = false;
  hide = true;
  loginForm: FormGroup;
  logoUrl = "/assets/images/expertflow-logo.png";
  spinner = false;
  rememberMe: boolean = true;

  validationMessages = {

    'username': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 40 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'password': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    }

  };

  formErrors = {
    username: '',
    password: '',
  };


  constructor(private router: Router,
    private endPointService: EndpointService,
    private commonService: CommonService,
    private snackbar: SnackbarService,
    private changeDetector: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [true]
    });

    this.loginForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.loginForm, this.formErrors, this.validationMessages);
      this.formErrors = result[0];
      this.validationMessages = result[1];
    });

  }

  login() {
    this.spinner = true;
    const data = this.loginForm.value
    this.endPointService.login(data).subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("res-->", res);
        if (data.rememberMe == true) {
          localStorage.setItem('username', res.keycloak_User.username);
          localStorage.setItem('tenant', res.keycloak_User.realm);
          localStorage.setItem('token', res.token);
          this.endPointService.token = res.token;

          sessionStorage.setItem('username', res.keycloak_User.username);
          sessionStorage.setItem('token', res.token);
          localStorage.setItem('tenant', res.keycloak_User.realm);
        }
        this.router.navigate(['/general/amq-settings']);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
      });
  }
}
