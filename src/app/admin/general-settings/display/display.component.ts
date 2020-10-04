import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {


  displaySettingForm: FormGroup;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.displaySettingForm = this.fb.group({
      agentAlias: [''],
      companyName: [''],
      companyLogo: ['']
    });
  }

  selectFile() { }

  onSave() { }

}
