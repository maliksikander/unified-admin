import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, ThemePalette } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {
  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 10;
  selectedItem = this.itemsPerPageList[1];
  spinner: any = true;
  searchTerm = '';
  formErrors = {
    name: '',
    description: '',
    type: '',
  };
  validations;
  attributeForm: FormGroup;
  attrType = ['Boolean', 'Proficient'];
  formHeading = 'Add New Attribute';
  saveBtnText = 'Create';
  attrData = [];
  editData;
  reqServiceType = 'attribute';

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {

    this.validations = this.commonService.attributeFormErrorMessages;

    this.attributeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      profVal: [1],
      boolVal: [true]
    });


    let pageNumber = localStorage.getItem('currentPage');
    if (pageNumber) {
      this.p = pageNumber;
    }

    this.attributeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.attributeForm, this.formErrors, this.validations);
    });

    this.getAttribute();
  }

  openModal(templateRef) {
    this.attributeForm.reset();
    this.attributeForm.controls['profVal'].patchValue(1);
    this.attributeForm.controls['boolVal'].patchValue(true);
    this.formHeading = 'Add New Attribute';
    this.saveBtnText = 'Create'
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

  createAttribute(data) {
    this.endPointService.create(data, this.reqServiceType).subscribe(
      (res: any) => {
        this.getAttribute();
        this.snackbar.snackbarMessage('success-snackbar', "Attribute Created Successfully", 1);
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  getAttribute() {
    this.endPointService.get(this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("attr res-->", res);
        this.attrData = res;
      },
      error => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  updateAttribute(data, id) {
    this.endPointService.update(data, id, this.reqServiceType).subscribe(
      (res: any) => {
        this.snackbar.snackbarMessage('success-snackbar', "Attribute Updated Successfully", 1);
        this.getAttribute();
        this.dialog.closeAll();
      },
      (error: any) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  deleteAttribute(data, id) {
    this.endPointService.delete(id, this.reqServiceType).subscribe(
      (res: any) => {
        this.spinner = false;
        // console.log("delete res -->", res);
        this.attrData = this.attrData.filter(i => i !== data)
          .map((i, idx) => (i.position = (idx + 1), i));
        this.snackbar.snackbarMessage('success-snackbar', "Attribute Deleted Successfully", 1);
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
      });
  }

  editAttribute(templateRef, data) {

    const typeIndex = this.attrType.indexOf(data.type);
    this.editData = data;

    this.attributeForm.patchValue({
      name: data.name,
      description: data.description,
      type: this.attrType[typeIndex],
      profVal: JSON.parse(data.value),
      boolVal: JSON.parse(data.value),
    });
    this.formHeading = 'Edit Attribute';
    this.saveBtnText = 'Update'
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      height: '400px',
      panelClass: 'add-attribute',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editData = undefined;
    });
  }

  deleteConfirm(data) {
    let id = data._id;
    let msg = "Are you sure you want to delete this attribute ?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        heading: "Delete Attribute",
        message: msg,
        text: 'confirm',
        data: data
      }
    }).afterClosed().subscribe((res: any) => {
      this.spinner = true;
      if (res === 'delete') { this.deleteAttribute(data, id); }
      else { this.spinner = false; }
    });
  }

  onSave() {

    let data: any = this.onSaveObject()
    if (this.editData) {
      this.updateAttribute(data, this.editData._id);
    }
    else {
      this.createAttribute(data);
    }
  }

  onSaveObject() {

    let data: any = {};
    data.name = this.attributeForm.value.name;
    data.description = this.attributeForm.value.description;
    data.type = this.attributeForm.value.type;
    if (this.attributeForm.value.type == 'Boolean') {
      data.value = JSON.stringify(this.attributeForm.value.boolVal);
    }
    else {
      data.value = JSON.stringify(this.attributeForm.value.profVal);
    }
    data.usageCount = null;

    return data;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  pageChange(e) {
    localStorage.setItem('currentPage', e);
  }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentPage', e); 
  }

  selectPage() {
    this.itemsPerPage = this.selectedItem;
  }

}

