import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
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
import { DatePipe } from '@angular/common';

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
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  underLineColor: ThemePalette = 'accent';
  defColor = '#25afcb';
  color = ['#CB2572', '#CB2525', '#7E25CB', '#3225CB', '#25CBC5', '#25AFCB', '#25CB85', '#5ECB25', '#C5CB25', '#FDC251', '#FF8307', '#FF2700'];
  defaultEndCriteria = "never";
  spinner = false;
  layoutOptions = ["day", "week", "month",];
  layout = new FormControl("month");
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDay;
  calendarForm: FormGroup;
  eventForm: FormGroup;
  recurrenceForm: FormGroup;
  endDateForm: FormGroup;
  // dateRange: FormGroup;
  formHeading = 'Create New Attribute';
  saveBtnText = 'Save';
  @ViewChild('colorMenuTrigger') colorMenuTrigger: MatMenuTrigger;
  recurrenceOptions = ['does not repeat', 'daily', 'custom']
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
  calendarList = [
    {
      id: "1",
      name: "Calendar 1",
      description: "description",
      color: '#77eb34',
      isChecked: true
    },
    {
      id: "2",
      name: "Calendar 2",
      description: "description",
      color: '#ffe70a',
      isChecked: false
    }
  ];

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
      start: subDays(new Date(), 0),
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
      start: new Date,
      title: 'An extra',
      color: { primary: "#485234", secondary: "#485234" },
      // actions: this.actions,
    },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: { primary: "#485234", secondary: "#485234" },
    //   // allDay: true,
    // },
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
  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  sunday = false;

  constructor(private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    // this.commonService.tokenVerification();
    this.currentDay = this.dateFormation("month");

    this.calendarForm = this.fb.group({
      name: [''],
      description: [''],
    });

    this.eventForm = this.fb.group({
      title: ['Title'],
      datePicker: [''],
      shift: ['Shift'],
      calendars: [''],
      color: [''],
      endDateCriteria: ['never'],
      recurrenceCriteria: ['does not repeat'],
      timeMessage: [''],
      // dateRange: this.fb.group({
      dateRangeStart: [''],
      dateRangeEnd: [''],
      // }),

    });
    this.recurrenceForm = this.fb.group({
      viewType: ['day'],
    });
    this.endDateForm = this.fb.group({
      endDate: [''],
    });

    this.eventForm.controls['datePicker'].setValue(new Date());
    this.endDateForm.controls['endDate'].setValue(new Date());
    this.eventForm.controls['dateRangeStart'].setValue(new Date());
    this.eventForm.controls['dateRangeEnd'].setValue(new Date(Date.now() + (3600 * 1000 * 24)));



    let d = new Date();
    this.setCurrentDay(d.getDay());
    // console.log("date -->", new Date());
    // console.log("date + 1-->", new Date(Date.now() + (3600 * 1000 * 24)));

    this.recurrenceForm.valueChanges.subscribe((data) => {
      // let result = this.commonService.logValidationErrors(this.amqSettingForm, this.formErrors, this.validations);
      // this.formErrors = result[0];
      // this.validations = result[1];
      console.log("change");
    });

    this.commonService._spinnerSubject.subscribe((res: any) => {
      this.spinner = res;
      this.changeDetector.markForCheck();
    });

    this.recurrenceListFormation();
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

  openCalendarModal(templateRef) {
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

  openEventModal(templateRef) {
    // this.eventForm.reset();
    this.formHeading = 'Create Event';
    this.saveBtnText = 'Save'
    let dialogRef = this.dialog.open(templateRef, {
      width: '550px',
      // height: '400px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openRecurrenceModal(templateRef) {

    // this.formHeading = 'Create Event';
    // this.saveBtnText = 'Save'
    let dialogRef = this.dialog.open(templateRef, {
      width: '450px',
      // height: '350px',
      panelClass: 'add-attribute',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEndDateModal(templateRef) {

    // this.formHeading = 'Create Event';
    // this.saveBtnText = 'Save'
    let dialogRef = this.dialog.open(templateRef, {
      width: '450px',
      // height: '350px',
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
  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  dayClicked(event) {
    console.log("day click", event);
    // if (isSameMonth(date, this.viewDate)) {
    //   if (
    //     (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //     events.length === 0
    //   ) {
    //     this.activeDayIsOpen = false;
    //   } else {
    //     this.activeDayIsOpen = true;
    //   }
    //   this.viewDate = date;
    // }
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

  handleEvent(action: string, event): void {
    // this.modalData = { event, action };
    // event.stopPropagation();
    // this.modal.open(this.modalContent, { size: 'lg' });
    console.log("event", event);
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

  onEventSave() {

  }

  onTimeChange(e) { }

  selectedColor = "#25abcf";
  onColorChange(e) {
    // console.log("color event-->", e);
    this.selectedColor = e.color.hex;
  }

  recurrenceListFormation() {

    // console.log("test-->", new Date.getDate())
  }



  daySelection(val) {

    if (val == 'mon') this.monday = !this.monday;
    else if (val == 'tue') this.tuesday = !this.tuesday;
    else if (val == 'wed') this.wednesday = !this.wednesday;
    else if (val == 'thur') this.thursday = !this.thursday;
    else if (val == 'fri') this.friday = !this.friday;
    else if (val == 'sat') this.saturday = !this.saturday;
    else if (val == 'sun') this.sunday = !this.sunday;

    if (this.monday == false && this.tuesday == false && this.wednesday == false && this.thursday == false && this.friday == false && this.saturday == false && this.sunday == false) {
      let d = new Date();
      this.setCurrentDay(d.getDay());
    }
  }

  setCurrentDay(val) {
    if (val == 1) this.monday = !this.monday;
    else if (val == 2) this.tuesday = !this.tuesday;
    else if (val == 3) this.wednesday = !this.wednesday;
    else if (val == 4) this.thursday = !this.thursday;
    else if (val == 5) this.friday = !this.friday;
    else if (val == 6) this.saturday = !this.saturday;
    else if (val == 7) this.sunday = !this.sunday;
  }

}