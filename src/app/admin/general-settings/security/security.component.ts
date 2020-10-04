import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  securitySettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.securitySettingForm = this.fb.group({
      certificatePath: [''],
      certificateKeyPath: [''],
      ssl: [''],
      certificateBundlePath: [''],
      privateKey: [''],
    });
  }

  onSave() { }
}
