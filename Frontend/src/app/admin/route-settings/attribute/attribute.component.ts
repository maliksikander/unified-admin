import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, ThemePalette } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  p: any = 1;
  itemsPerPageList = [5, 10, 15];
  itemsPerPage = 5;
  selectedItem = this.itemsPerPageList[0];
  spinner: any = true;
  searchTerm = '';
  formErrors = {
    name: '',
    description: '',
    type: '',
  };
  validations;
  attributeForm: FormGroup;
  // attrType = ['BOOLEAN', 'PROFICIENCY_LEVEL'];
  formHeading = 'Add New Attribute';
  saveBtnText = 'Create';
  attrData = [];
  editData;
  reqServiceType = 'routing-attributes';

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private endPointService: EndpointService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.validations = this.commonService.attributeFormErrorMessages;

    this.attributeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(15), Validators.pattern("^[a-zA-Z0-9!@#$%^*_&()\\\"-]*$")]],
      description: ['', [Validators.maxLength(50)]],
      type: ['', [Validators.required]],
      profVal: [1],
      boolVal: [true]
    });

    let pageNumber = localStorage.getItem('currentAttributePage');
    if (pageNumber) this.p = pageNumber;

    this.attributeForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.attributeForm, this.formErrors, this.validations);
    });
    // this.endPointService.readConfigJson().subscribe((e) => {
      this.getAttribute();
    // });
  }

  ValidateNameDuplication(control: AbstractControl) {
    return this.endPointService.get(this.reqServiceType).pipe(map(
      e => {
        const attr = e;
        if (!this.editData && (attr.find(e => e.name.toLowerCase() == control.value.toLowerCase()))) return { validName: true };
        if (this.editData && this.editData.length > 0) {
          const attr2 = attr;
          const index = attr2.findIndex(e => e.name == this.editData.name);
          attr2.splice(index, 1);
          if (attr2.find(e => e.name.toLowerCase() == control.value.toLowerCase())) return { validName: true };
        }
      }
    ));
  }

  openModal(templateRef) {
    this.attributeForm.reset();
    this.attributeForm.controls['profVal'].patchValue(1);
    this.attributeForm.controls['boolVal'].patchValue(true);
    this.formHeading = 'Add New Attribute';
    this.saveBtnText = 'Create'
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      height: '440px',
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
        this.attrData = res;
        if (res.length == 0) this.snackbar.snackbarMessage('error-snackbar', "NO DATA FOUND", 2);
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
        this.attrData = this.attrData.filter(i => i !== data)
          .map((i, idx) => (i.position = (idx + 1), i));
        this.snackbar.snackbarMessage('success-snackbar', "Attribute Deleted Successfully", 1);
      },
      (error) => {
        this.spinner = false;
        console.log("Error fetching:", error);
        if (error && error.status == 0) this.snackbar.snackbarMessage('error-snackbar', error.statusText, 1);
        if (error && error.status == 409) this.snackbar.snackbarMessage('error-snackbar', "Attribute in use,cannot be deleted", 1);
      });
  }

  editAttribute(templateRef, data) {
    // const typeIndex = this.attrType.indexOf(data.type);
    this.editData = data;
    this.attributeForm.patchValue({
      name: data.name,
      description: data.description,
      type: data.type,
      profVal: JSON.parse(data.defaultValue),
      boolVal: JSON.parse(data.defaultValue),
    });
    this.formHeading = 'Edit Attribute';
    this.saveBtnText = 'Update'
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      height: '440px',
      panelClass: 'add-attribute',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editData = undefined;
    });
  }

  deleteConfirm(data) {
    let id = data.id;
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
    this.spinner = true;
    let data: any = this.onSaveObject();
    if (this.editData) {
      this.updateAttribute(data, this.editData.id);
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
    if (this.attributeForm.value.type == 'BOOLEAN') {
      data.defaultValue = JSON.stringify(this.attributeForm.value.boolVal);
    }
    else {
      data.defaultValue = JSON.stringify(this.attributeForm.value.profVal);
    }
    return data;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  pageChange(e) { localStorage.setItem('currentAttributePage', e); }

  pageBoundChange(e) {
    this.p = e;
    localStorage.setItem('currentAttributePage', e);
  }

  selectPage() { this.itemsPerPage = this.selectedItem; }

}