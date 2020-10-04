import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {

  logSettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.logSettingForm = this.fb.group({
      agentLogLevel: [''],
      agentLogMaxFiles: [''],
      agentLogFileSize: [''],
      agentLogFilePath: [''],
      enableLogs:[false]
    });

  }

  onSave() { }
}
