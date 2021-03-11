import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';

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
      'pattern': "Pattern not valid"

    },
    'amqPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': "Pattern not valid"
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
    },
    'amqUrl': {
      'required': "This field is required",
      'pattern': 'Enter a valid url'
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
    },
    'eabcDBDialect': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
    },
    'eabcDBUser': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed",
    },
    'eabcDBPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
    },
    'ecmDBUrl': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
      'pattern': 'Enter a valid url'
    },
    'ecmDBDriver': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
    },
    'ecmDBDialect': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
    },
    'ecmDBUser': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed",
    },
    'ecmDBPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
    },
    'ecmDBEngine': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
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
    },
    'logFilePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed",
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
    },
    'certificateKeypath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'certificatePassphrase': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'certificateAuthorityPath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'certificateAuthorityPassphrase': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'keystorePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'keystorePwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'truststorePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'truststorePwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'jksKeystorePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'jksKeystorePwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'jksKeymanagerPwd': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'amqCertificatePath': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'amqCertificatePassphrase': {
      'required': "This field is required",
      'maxlength': "Max 256 characters allowed"
    },
    'corsOrigin': {
      'required': "This field is required",
      'maxlength': "Max 40 characters allowed"
    },
    'commBypassSSL': {
      'required': "This field is required",
    },
    'enableSSL': {
      'required': "This field is required",
    },
    'minioSSL': {
      'required': "This field is required",
    },
    'mongoSSL': {
      'required': "This field is required",
    },
    'stompSSLEnabled': {
      'required': "This field is required",
    },
  };

  attributeFormErrorMessages = {
    'name': {
      'required': "This field is required",
      'minlength': "Min 3 characters required",
      'maxlength': "Max 500 characters allowed",
      'pattern': 'Not a valid pattern',
      'validName': 'Already exists'

    },
    'description': {
      'required': "This field is required",
      'maxlength': "Max 500 characters allowed",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'type': {
      'required': "This field is required",
    },
  };

  mrdFormErrorMessages = {
    'name': {
      'required': "This field is required",
      'minlength': "Min 3 characters required",
      'maxlength': "Max 110 characters allowed",
      'pattern': 'Not a valid pattern',
      'validName': 'Already exists'

    },
    'description': {
      'required': "This field is required",
      'maxlength': "Max 500 characters allowed",
      'pattern': "Not a valid pattern"
    },
    'enabled': {
      'required': "This field is required",
    },
  };

  queueFormErrorMessages = {
    'name': {
      'required': "This field is required",
      'minlength': "Min 3 characters required",
      'maxlength': "Max 50 characters allowed",
      'pattern': 'Not a valid pattern',
      'validName': 'Already exists'

    },
    'mrd': {
      'required': "This field is required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'agentCriteria': {
      'required': "This field is required",
    },
    'serviceLevelType': {
      'required': "This field is required",
      'min': "Min 1 required",
      'max': "Max 10 seconds allowed",
    },
    'serviceLevelThreshold': {
      'required': "This field is required",
      'min': "Min 1 required",
      'max': "Max 10 seconds allowed",
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
    },
    'lastName': {
      'required': "This field is required",
    }
  };

  connectorFormErrorMessages = {
    'channelConnectorName': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'

    },
    'channelWebhook': {
      'required': "This field is required",
      'pattern': "Enter valid url"
    },
  };

  channelFormErrorMessages = {
    'channelName': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'serviceIdentifier': {
      'required': "This field is required",
      'pattern': "Enter valid url"
    },
    'channelConnector': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'channelMode': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'responseSLA': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'customerActivityTimeout': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'botId': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
  };

  botFormErrorMessages = {
    'botName': {
      'required': "This field is required",
      'minlength': "More characters required",
      'maxlength': "Less characters required",
      'pattern': 'Allowed special characters "[!@#\$%^&*()-_=+~`\"]+"'
    },
    'botURL': {
      'required': "This field is required",
      'pattern': "Enter valid url"
    },
    'botFile': {
      'required': "This field is required",
      'pattern': "Enter valid url"
    },
  };

  constructor(private snackbar: SnackbarService,
    private router: Router) { }

  //assign form validation errors dynamically
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

  // verifying token existence form local storage
  tokenVerification() {
    if (!localStorage.getItem('token')) {
      return this.router.navigate(['/login']);
    }
  }
}