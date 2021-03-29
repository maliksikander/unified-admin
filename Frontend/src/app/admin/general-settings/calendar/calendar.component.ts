import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { EndpointService } from '../../services/endpoint.service';
import { SnackbarService } from '../../services/snackbar.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  endOfDecade,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter,
  CalendarView,
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit {

  spinner = false;
  layoutOptions = ["day", "week", "month",];
  layout = new FormControl("month");
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDay;
  calendarForm: FormGroup;
  formHeading = 'Create New Attribute';
  saveBtnText = 'Save';

  // colors: any = {
  //   red: {
  //     primary: '#ad2121',
  //     secondary: '#FAE3E3',
  //   },
  //   blue: {
  //     primary: '#25AFCB',
  //     secondary: '#D1E8FF',
  //   },
  //   yellow: {
  //     primary: '#e3bc08',
  //     secondary: '#FDF1BA',
  //   },
  // };
  // static: boolean;
  // @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
  // };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()),0),
      end: addDays(new Date(), 3),
      title: 'A 3 day event',
      color: { primary: "#25AFCB", secondary: "#25AFCB" },
      // actions: this.actions,
      allDay: true,
      meta: {
        eventType: "",
        shift: {}
      }
      // resizable: {
      //   beforeStart: true,
      //   afterEnd: true,
      // },
      // draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { primary: "#b22222", secondary: "#b22222" },
      // actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { primary: "#485234", secondary: "#485234" },
      // allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      // end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { primary: "#a7a7a7", secondary: "#a7a7a7" },
      // actions: this.actions,
      // resizable: {
      //   beforeStart: true,
      //   afterEnd: true,
      // },
      // draggable: false,
    },
  ];

  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    // private modal: NgbModal
  ) { }

  ngOnInit() {

    this.commonService.tokenVerification();
    this.currentDay = this.dateFormation("month");

    this.calendarForm = this.fb.group({
      name: [''],
      description: [''],
    });

    console.log("date-->", new Date());

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

  monthChange() {
    // console.log("vall-->",this.layout.value);

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

  onSave() { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // console.log("events-->",events);
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      // ...this.events,
      // {
      //   title: 'New event',
      //   start: startOfDay(new Date()),
      //   end: endOfDay(new Date()),
      //   color: this.colors.red,
      //   draggable: true,
      //   resizable: {
      //     beforeStart: true,
      //     afterEnd: true,
      //   },
      // },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(e) {
    this.view = e.value;
    this.currentDay = this.dateFormation(e.value);
    // console.log("view-->",e)
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}











