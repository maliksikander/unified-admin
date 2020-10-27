import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, ThemePalette } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  spinner: any = false;
  searchTerm = '';
  formErrors = {
    name: '',
    description: '',
    type: '',
  };
  validations;
  attributeForm: FormGroup;
  attrType = ['boolean', 'proficiency'];
  formHeading ='Add New Attribute';

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {

    this.validations = this.commonService.attributeFormErrorMessages;


    this.attributeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      profVal: [''],
      boolVal:[true]
    });

    this.attributeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.attributeForm, this.formErrors, this.validations);
    });
  }

  openModal(templateRef) {
    this.attributeForm.reset();
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      height: '400px',
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

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
}

