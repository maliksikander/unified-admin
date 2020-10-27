import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


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
  formHeading = 'User Profile';
  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit() {
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
