import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormGroup } from '@angular/forms';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  themeVersion = new Subject();
  _spinnerSubject = new Subject();

  amqSettingErrorMessages = {

    'amqUsername': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'amqPwd': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'amqHost': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'amqPort': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'amqUrl': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }

  };
  databaseSettingErrorMessages = {

    'mongoUrl': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'eabcDBUrl': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'eabcDBDriver': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'eabcDBDialect': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'eabcDBUser': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'eabcDBPwd': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBUrl': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBDriver': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBDialect': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBUser': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBPwd': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBEngine': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }

  };
  displaySettingErrorMessages = {

    'agentAlias': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'companyName': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'companyLogo': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },

  };
  localeSettingErrorMessages = {

    'timezone': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'language': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'supportedLanguages': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }
  };
  logSettingErrorMessages = {

    'agentLogLevel': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'agentLogMaxFiles': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'agentLogFileSize': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'agentLogFilePath': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }

  };
  reportSettingErrorMessages = {

    'dbName': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'dbUsername': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'dbPwd': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'dbUrl': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }

  };
  securitySettingErrorMessages = {

    'certificatePath': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'certificateKeyPath': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'ssl': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'certificateBundlePath': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'privateKey': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }

  };


  constructor(private snackbar: SnackbarService) {
  }

  logValidationErrors(group: FormGroup, formErrors, validations) {

    let result = [];
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl, formErrors, validations);
      } else {
        formErrors[key] = '';
        if (abstractControl && !abstractControl.valid) {
          const messages = validations[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });

    result = [formErrors, validations];
    return result;
  }
}
