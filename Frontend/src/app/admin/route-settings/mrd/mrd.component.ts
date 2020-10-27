import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-mrd',
  templateUrl: './mrd.component.html',
  styleUrls: ['./mrd.component.scss']
})
export class MrdComponent implements OnInit {

  spinner: any = false;
  searchTerm = '';
  formErrors = {
    name: '',
    description: '',
    enabled: '',
  };
  validations;
  mrdForm: FormGroup;
  formHeading ='Add New MRD';

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.validations = this.commonService.mrdFormErrorMessages;

    this.mrdForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      enabled: [],
    });

    this.mrdForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.mrdForm, this.formErrors, this.validations);
    });

  }

  openModal(templateRef) {
    this.mrdForm.reset();
    let dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onClose() {
    this.dialog.closeAll();
    this.searchTerm = "";
  }

  onSave() { }
}
