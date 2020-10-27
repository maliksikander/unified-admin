import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-precision-queue',
  templateUrl: './precision-queue.component.html',
  styleUrls: ['./precision-queue.component.scss']
})
export class PrecisionQueueComponent implements OnInit {

  spinner: any = false;
  searchTerm = '';
  formErrors = {
    name: '',
    associatedMrd: '',
    agentCriteria: '',
    serviceLevelType: '',
    serviceLevelThreshold: '',
  };
  validations;
  queueForm: FormGroup;
  formHeading = 'Add New Queue';
  agentCriteria = ['longest available', 'most skilled', 'least skilled'];
  serviceLevelType = ['ignore abandoned chats', 'abandoned chats have a negative impact', 'abandoned chats have a positive impact'];

  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {

    this.validations = this.commonService.queueFormErrorMessages;

    this.queueForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      associatedMrd: [''],
      agentCriteria: [],
      serviceLevelType: [''],
      serviceLevelThreshold: ['',[Validators.required,Validators.min(1),Validators.max(10)]],
    });

    this.queueForm.valueChanges.subscribe((data) => {
      this.commonService.logValidationErrors(this.queueForm, this.formErrors, this.validations);
    });

  }

  openModal(templateRef) {
    this.queueForm.reset();
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
}
