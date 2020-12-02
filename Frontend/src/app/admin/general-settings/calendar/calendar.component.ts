import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  spinner = false;
  layoutOptions = ["day", "week", "month",];
  layout = new FormControl("month");
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDay;
  calendarForm: FormGroup;
  formHeading = 'Create New Attribute';
  saveBtnText = 'Save'

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.currentDay = this.dateFormation("month");

    this.calendarForm = this.fb.group({
      name: [''],
      description: [''],
    });


    // this.licenseForm.valueChanges.subscribe((data) => {
      //   let result = this.commonService.logValidationErrors(this.amqSettingForm, this.formErrors, this.validations);
      //   this.formErrors = result[0];
      //   this.validations = result[1];
      // });
  
    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

  }

  layoutChange(e) {
    this.currentDay = this.dateFormation(e.value);
    
  }

  dateFormation(val) {
    let result;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = this.monthNames[today.getMonth()];
    let yyyy = today.getFullYear();
    if (val == "week" || val == "day") {
      result = mm + ' ' + dd + ',' + yyyy;
    }
    else {
      result = mm + ' ' + yyyy;
    }
    return result;
  }

  openModal(templateRef) {
    this.calendarForm.reset();
    this.formHeading = 'Create New Calendar';
    this.saveBtnText = 'Save'
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
    // this.searchTerm = "";
  }

  onSave(){

  }
}
