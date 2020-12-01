import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,) { }

  ngOnInit() {

    this.currentDay = this.dateFormation("month")
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
}
