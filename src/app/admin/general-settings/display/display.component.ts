import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {


  displaySettingForm: FormGroup;
  formErrors = {
    agentAlias: '',
    companyName: '',
    companyLogo: ''
  };
  validations;
  public imagePath;
  imageName = '';
  imgURL: any;
  currentLogo;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService) {
  }

  ngOnInit() {


    this.validations = this.commonService.displaySettingErrorMessages;

    this.displaySettingForm = this.fb.group({
      agentAlias: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyLogo: ['']
    });

    this.displaySettingForm.controls['companyLogo'].disable();
    this.displaySettingForm.valueChanges.subscribe((data) => {
      let result = this.commonService.logValidationErrors(this.displaySettingForm, this.formErrors, this.validations);
      this.formErrors = result[0];
      this.validations = result[1];
    });
  }

  preview(files, e) {
    var reader = new FileReader();
    this.imagePath = files;
    if (files.length != 0) {
      if (files[0].size > 2097152) return this.snackbar.snackbarMessage('error-snackbar', 'Image Size greater than 2Mb', 3);
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.imageName = e.target.files[0].name;
        // if (this.imgURL) {
        //   this.buttonCheck = true;
        // }
      }
    }
  }


  selectFile() { }

  onSave() { }

}
