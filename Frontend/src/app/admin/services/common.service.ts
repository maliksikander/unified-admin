import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  themeVersion = new Subject();
  _spinnerSubject = new Subject();


  amqSettingErrorMessages = {

    'amqUser': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 40 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'amqPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'amqHost': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': "Pattern not valid"
    },
    'amqPort': {
      'required': "This field is required",
      'min': "Enter valid port number",
      'max': "Enter valid port number",
      'pattern': 'Enter valid port number'
      // 'pattern': this.service_url_pattern
    },
    'amqUrl': {
      'required': "This field is required",
      'pattern': 'Enter a valid url'
      // 'pattern': this.service_url_pattern
    }

  };
  databaseSettingErrorMessages = {

    'mongoUrl': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Enter a valid url'
    },
    'eabcDBUrl': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': 'Enter a valid url'
    },
    'eabcDBDriver': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'eabcDBDialect': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'eabcDBUser': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'eabcDBPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBUrl': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': 'Enter a valid url'
    },
    'ecmDBDriver': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBDialect': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBUser': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'ecmDBEngine': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    }

  };
  displaySettingErrorMessages = {

    'agentAlias': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 40 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'companyDisplayName': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed",
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
    'defaultLanguage': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'supportedLanguages': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }
  };
  logSettingErrorMessages = {

    'logLevel': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'agentLogsMaxFiles': {
      'required': "This field is required",
      'min': "Min size should be 1 Mb",
      'max': "Max file quantity should be 1000",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'agentLogsFileSize': {
      'required': "This field is required",
      'min': "Min size should be 1 Mb",
      'max': "Max size should be 1024 Mb",
      // 'pattern': this.service_url_pattern
    },
    'logFilePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    }

  };
  reportSettingErrorMessages = {

    'rcDBName': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 40 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'rcDBUser': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'rcDBPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'rcDBUrl': {
      'required': "This field is required",
      'pattern': 'Enter a valid url'
    }

  };
  securitySettingErrorMessages = {

    'certificatePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      // 'pattern': this.service_url_pattern
    },
    'certificateKeypath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'certificatePassphrase': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'certificateAuthorityPath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'certificateAuthorityPassphrase': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'keystorePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'keystorePwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'truststorePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'truststorePwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'jksKeystorePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'jksKeystorePwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'jksKeymanagerPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'amqCertificatePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'amqCertificatePassphrase': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'corsOrigin': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed"
      // 'pattern': this.service_url_pattern
    },
    'commBypassSSL': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'enableSSL': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'minioSSL': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'mongoSSL': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'stompSSLEnabled': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
  };

  attributeFormErrorMessages = {

    'name': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 15 characters allowed",
      'pattern': 'Not a valid pattern',
      'validName':'Already exists'

    },
    'description': {
      'required': "This field is required",
      'maxlength': "Max 50 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'type': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
  };


  mrdFormErrorMessages = {

    'name': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 15 characters allowed",
      'pattern': 'Not a valid pattern',
      'validName':'Already exists'

    },
    'description': {
      'required': "This field is required",
      'maxlength': "Max 50 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'enabled': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
  };


  queueFormErrorMessages = {

    'name': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Max 15 characters allowed",
      'pattern': 'Not a valid pattern',
      'validName':'Already exists'

    },
    'mrd': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'agentCriteria': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'serviceLevelType': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'serviceLevelThreshold': {
      'required': "This field is required",
      'min': "Min 1 second required",
      'max': "Max 10 seconds allowed",
      // 'pattern': this.service_url_pattern
    },
  };


  userFormErrorMessages = {

    'agentId': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'attributes': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'firstName': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    },
    'lastName': {
      'required': "This field is required",
      // 'pattern': this.service_url_pattern
    }
  };
  constructor(private snackbar: SnackbarService) { }

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
