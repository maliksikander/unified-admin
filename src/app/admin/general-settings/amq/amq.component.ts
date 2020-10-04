import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-amq',
  templateUrl: './amq.component.html',
  styleUrls: ['./amq.component.scss']
})
export class AmqComponent implements OnInit {
  amqSettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.amqSettingForm = this.fb.group({
      amqUsername: [''],
      amqPwd: [''],
      amqHost: [''],
      amqPort: [''],
      amqUrl: [''],
    });
  }

  onSave() { }

}
