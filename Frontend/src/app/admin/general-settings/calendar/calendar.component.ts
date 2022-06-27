import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { CommonService } from "../../services/common.service";
import { EndpointService } from "../../services/endpoint.service";
import { SnackbarService } from "../../services/snackbar.service";
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
} from "date-fns";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter,
  CalendarView,
  CalendarDayViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
  CalendarMonthViewBeforeRenderEvent,
} from "angular-calendar";
import { CustomDateFormatter } from "./custom-date-formatter.provider";
import { Subject } from "rxjs";
import { DatePipe, Time } from "@angular/common";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import RRule from "rrule";
import * as moment from "moment-timezone";
import { ViewPeriod } from "calendar-utils";

interface RecurringEvent {
  title: string;
  color: any;
  start?: Date;
  end?: Date;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
    interval?: any;
    until?: any;
    dtstart?: any;
  };
}
moment.tz.setDefault("Utc");
@Component({
  selector: "app-calendar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  // encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  selectTime = [
    { value: "5:00 AM", viewValue: "5:00 AM" },
    { value: "5:15 AM", viewValue: "5:15 AM" },
    { value: "5:30 AM", viewValue: "5:30 AM" },
    { value: "5:45 AM", viewValue: "5:45 AM" },

    { value: "6:00 AM", viewValue: "6:00 AM" },
    { value: "6:15 AM", viewValue: "6:15 AM" },
    { value: "6:30 AM", viewValue: "6:30 AM" },
    { value: "6:45 AM", viewValue: "6:45 AM" },

    { value: "7:00 AM", viewValue: "7:00 AM" },
    { value: "7:15 AM", viewValue: "7:15 AM" },
    { value: "7:30 AM", viewValue: "7:30 AM" },
    { value: "7:45 AM", viewValue: "7:45 AM" },

    { value: "8:00 AM", viewValue: "8:00 AM" },
    { value: "8:15 AM", viewValue: "8:15 AM" },
    { value: "8:30 AM", viewValue: "8:30 AM" },
    { value: "8:45 AM", viewValue: "8:45 AM" },

    { value: "9:00 AM", viewValue: "9:00 AM" },
    { value: "9:15 AM", viewValue: "9:15 AM" },
    { value: "9:30 AM", viewValue: "9:30 AM" },
    { value: "9:45 AM", viewValue: "9:45 AM" },

    { value: "10:00 AM", viewValue: "10:00 AM" },
    { value: "10:15 AM", viewValue: "10:15 AM" },
    { value: "10:30 AM", viewValue: "10:30 AM" },
    { value: "10:45 AM", viewValue: "10:45 AM" },

    { value: "11:00 AM", viewValue: "11:00 AM" },
    { value: "11:15 AM", viewValue: "11:15 AM" },
    { value: "11:30 AM", viewValue: "11:30 AM" },
    { value: "11:45 AM", viewValue: "11:45 AM" },

    { value: "12:00 PM", viewValue: "12:00 PM" },
    { value: "12:15 PM", viewValue: "12:15 PM" },
    { value: "12:30 PM", viewValue: "12:30 PM" },
    { value: "12:45 PM", viewValue: "12:45 PM" },

    { value: "1:00 PM", viewValue: "1:00 PM" },
    { value: "1:15 PM", viewValue: "1:15 PM" },
    { value: "1:30 PM", viewValue: "1:30 PM" },
    { value: "1:45 PM", viewValue: "1:45 PM" },

    { value: "2:00 PM", viewValue: "2:00 PM" },
    { value: "2:15 PM", viewValue: "2:15 PM" },
    { value: "2:30 PM", viewValue: "2:30 PM" },
    { value: "2:45 PM", viewValue: "2:45 PM" },

    { value: "3:00 PM", viewValue: "3:00 PM" },
    { value: "3:15 PM", viewValue: "3:15 PM" },
    { value: "3:30 PM", viewValue: "3:30 PM" },
    { value: "3:45 PM", viewValue: "3:45 PM" },

    { value: "4:00 PM", viewValue: "4:00 PM" },
    { value: "4:15 PM", viewValue: "4:15 PM" },
    { value: "4:30 PM", viewValue: "4:30 PM" },
    { value: "4:45 PM", viewValue: "4:45 PM" },

    { value: "5:00 PM", viewValue: "5:00 PM" },
    { value: "5:15 PM", viewValue: "5:15 PM" },
    { value: "5:30 PM", viewValue: "5:30 PM" },
    { value: "5:45 PM", viewValue: "5:45 PM" },

    { value: "6:00 PM", viewValue: "6:00 PM" },
    { value: "6:15 PM", viewValue: "6:15 PM" },
    { value: "6:30 PM", viewValue: "6:30 PM" },
    { value: "6:45 PM", viewValue: "6:45 PM" },

    { value: "7:00 PM", viewValue: "7:00 PM" },
    { value: "7:15 PM", viewValue: "7:15 PM" },
    { value: "7:30 PM", viewValue: "7:30 PM" },
    { value: "7:45 PM", viewValue: "7:45 PM" },

    { value: "8:00 PM", viewValue: "8:00 PM" },
    { value: "8:15 PM", viewValue: "8:15 PM" },
    { value: "8:30 PM", viewValue: "8:30 PM" },
    { value: "8:45 PM", viewValue: "8:45 PM" },

    { value: "9:00 PM", viewValue: "9:00 PM" },
    { value: "9:15 PM", viewValue: "9:15 PM" },
    { value: "9:30 PM", viewValue: "9:30 PM" },
    { value: "9:45 PM", viewValue: "9:45 PM" },

    { value: "10:00 PM", viewValue: "10:00 PM" },
    { value: "10:15 PM", viewValue: "10:15 PM" },
    { value: "10:30 PM", viewValue: "10:30 PM" },
    { value: "10:45 PM", viewValue: "10:45 PM" },

    { value: "11:00 PM", viewValue: "11:00 PM" },
    { value: "11:15 PM", viewValue: "11:15 PM" },
    { value: "11:30 PM", viewValue: "11:30 PM" },
    { value: "11:45 PM", viewValue: "11:45 PM" },
  ];
  calendarPreviewData = {};
  selectedTimeFrom = this.selectTime[0].value;
  editView = false;
  underLineColor: ThemePalette = "accent";
  defColor = "#25afcb";
  color = [
    "#CB2572",
    "#CB2525",
    "#7E25CB",
    "#3225CB",
    "#25CBC5",
    "#25AFCB",
    "#25CB85",
    "#5ECB25",
    "#C5CB25",
    "#FDC251",
    "#FF8307",
    "#FF2700",
  ];
  defaultEndCriteria = "never";

  layoutOptions = ["day", "week", "month"];
  layout = new FormControl("month");
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  currentDay;
  calendarForm: FormGroup;
  eventForm: FormGroup;
  recurrenceForm: FormGroup;
  endDateForm: FormGroup;
  formHeading = "Create New Attribute";
  saveBtnText = "Save";
  @ViewChild("colorMenuTrigger") colorMenuTrigger: MatMenuTrigger;
  recurrenceOptions = ["does not repeat", "daily", "custom"];

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  calendarList = [];

  events: CalendarEvent[] = [
    {
      start: subDays(new Date("Wed Sep 06 2021 12:00:00 GMT+0500"), 0),
      end: new Date("Wed Sep 06 2021 16:00:00 GMT+0500"),
      title: "A 3 day event",
      color: { primary: "#25AFCB", secondary: "#25AFCB" },
      // allDay: true,
      meta: {
        eventType: "Holiday",
      },
    },
    {
      start: startOfDay(new Date()),
      title: "An event with no end date",
      color: { primary: "#b22222", secondary: "#b22222" },
      meta: {
        eventType: "Out Of Office",
        shift: {},
      },
    },
    // {
    //   start: new Date(),
    //   title: "An extra",
    //   color: { primary: "#485234", secondary: "#485234" },
    //   // actions: this.actions,
    //   meta: {
    //     calendarType: "Holiday",
    //     eventType: "",
    //     shift: {},
    //   },
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   // end: addHours(new Date(), 2),
    //   title: "A draggable and resizable event",
    //   color: { primary: "#a7a7a7", secondary: "#a7a7a7" },
    //   // actions: this.actions,
    //   // resizable: {
    //   //   beforeStart: true,
    //   //   afterEnd: true,
    //   // },
    //   // draggable: false,
    // },
  ];

  calendarEvents: CalendarEvent[] = [];

  recurringEvents: RecurringEvent[] = [
    // {
    //   title: "Recurs on the 5th of each month",
    //   color: { primary: "#c5cb25", secondary: "#c5cb25" },
    //   rrule: {
    //     freq: RRule.MONTHLY,
    //     bymonthday: 5,
    //   },
    // },
    {
      title: "Reoccurs Weekly",
      color: { primary: "#ff2700", secondary: "#ff2700" },
      start: new Date("Mon Sep 06 2021 16:00:00 GMT+0500"),
      end: new Date("Mon Sep 06 2021 19:00:00 GMT+0500"),
      rrule: {
        freq: RRule.WEEKLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: new Date(Date.UTC(2021, 8, 1, 10, 0, 0)),
        until: new Date(Date.UTC(2021, 8, 10, 19, 0, 0)),
        interval: 1,
      },
    },
    // {
    //   title: "Recurs yearly on the 10th of the current month",
    //   color: { primary: "#25AFCB", secondary: "#25AFCB" },
    //   rrule: {
    //     freq: RRule.YEARLY,
    //     bymonth: moment().month() + 1,
    //     bymonthday: 10,
    //   },
    // },
  ];

  viewPeriod: ViewPeriod;

  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  sunday = false;
  selectedColor = "#25abcf";
  editCalendarData;

  spinner = true;

  constructor(
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private endPointService: EndpointService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.commonService.tokenVerification();

    this.currentDay = this.dateFormation("month");

    this.calendarForm = this.fb.group({
      name: [""],
      description: [""],
      color: [""],
    });

    this.eventForm = this.fb.group({
      title: ["Title", [Validators.required]],
      datePicker: [""],
      shift: ["Shift"],
      calendars: ["", [Validators.required]],
      color: [""],
      endDateCriteria: ["never"],
      recurrenceCriteria: ["does not repeat"],
      timeMessage: [""],
      // dateRange: this.fb.group({
      dateRangeStart: [""],
      dateRangeEnd: [""],

      // }),
    });

    this.recurrenceForm = this.fb.group({
      viewType: ["day"],
    });
    this.endDateForm = this.fb.group({
      endDate: [""],
    });

    this.eventForm.controls["datePicker"].setValue(new Date());
    this.endDateForm.controls["endDate"].setValue(new Date());
    this.eventForm.controls["dateRangeStart"].setValue(new Date());
    this.eventForm.controls["dateRangeEnd"].setValue(
      new Date(Date.now() + 3600 * 1000 * 24)
    );

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

    // this.commonService._spinnerSubject.subscribe((res: any) => {
    //   this.spinner = res;
    //   this.changeDetector.markForCheck();
    // });

    this.recurrenceListFormation();
    this.getCalendarList();
    // this.updateCalendar();
    this.cd.detectChanges();
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
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = this.monthNames[today.getMonth()];
    let yyyy = today.getFullYear();
    if (val == "week" || val == "day") {
      result = mm + " " + dd + "," + yyyy;
    } else {
      result = mm + " " + yyyy;
    }
    return result;
  }

  openEventModal(templateRef) {
    // this.eventForm.reset();
    this.formHeading = "Create Event";
    this.saveBtnText = "Save";
    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      // height: '400px',
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openRecurrenceModal(templateRef) {
    // this.formHeading = 'Create Event';
    // this.saveBtnText = 'Save'
    let dialogRef = this.dialog.open(templateRef, {
      width: "450px",
      // height: '350px',
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openEndDateModal(templateRef) {
    // this.formHeading = 'Create Event';
    // this.saveBtnText = 'Save'
    let dialogRef = this.dialog.open(templateRef, {
      width: "450px",
      // height: '350px',
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  onClose() {
    this.dialog.closeAll();
    // this.searchTerm = "";
  }

  onSave() {}

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
    this.calendarEvents = this.calendarEvents.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event): void {
    // this.modalData = { event, action };
    // event.stopPropagation();
    // this.modal.open(this.modalContent, { size: 'lg' });
    console.log("event", event);
  }

  addEvent(): void {
    this.calendarEvents = [
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
    this.calendarEvents = this.calendarEvents.filter(
      (event) => event !== eventToDelete
    );
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
    console.log("end data form==>", this.endDateForm.value);
    console.log("event form =>", this.eventForm.value);

    let startDate = "Wed Sep 10 2021 12:00:00 GMT+0500";
    let endDate = "Wed Sep 21 2021 16:00:00 GMT+0500";

    // console.log(
    //   "day diff==>",
    //   Math.abs(this.calculateDiff(startDate, endDate))
    // );

    let data = {
      color: { primary: this.selectedColor, secondary: this.selectedColor },
      meta: {},
    };
  }

  calculateDiff(first, second) {
    let currentDate = new Date(first);
    let endDate = new Date(second);
    return Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
  }

  onTimeChange(e) {}

  onColorChange(e) {
    // console.log("color event-->", e);
    this.selectedColor = e.color.hex;
    this.eventForm.controls["color"].setValue(this.selectedColor);
    // if (mode == "calendar") {
    //   this.calendarForm.controls["color"].setValue(this.selectedColor);
    // }
  }

  recurrenceListFormation() {
    // console.log("test-->", new Date.getDate())
  }

  daySelection(val) {
    if (val == "mon") this.monday = !this.monday;
    else if (val == "tue") this.tuesday = !this.tuesday;
    else if (val == "wed") this.wednesday = !this.wednesday;
    else if (val == "thur") this.thursday = !this.thursday;
    else if (val == "fri") this.friday = !this.friday;
    else if (val == "sat") this.saturday = !this.saturday;
    else if (val == "sun") this.sunday = !this.sunday;

    if (
      this.monday == false &&
      this.tuesday == false &&
      this.wednesday == false &&
      this.thursday == false &&
      this.friday == false &&
      this.saturday == false &&
      this.sunday == false
    ) {
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

  recurrence(event, templateRef) {
    if (event.value === "custom") {
      let dialogRef = this.dialog.open(templateRef, {
        width: "500px",
        minHeight: "170px",
        panelClass: "add-attribute",
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  previewEvent(event, templateRef) {
    console.log("calendar event", event);
    this.calendarPreviewData = event;
    const dialogRef = this.dialog.open(templateRef, {
      width: "520px",
      // height: '350px',
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.editView = false;
    });
  }

  deleteSaveEvent(e) {
    let msg = "Are you sure you want to delete " + e.title + "?";
    return this.dialog.open(ConfirmDialogComponent, {
      panelClass: "confirm-dialog-container",
      disableClose: true,
      width: "450px",
      data: {
        heading: "Delete calendar",
        message: msg,
        text: "confirm",
      },
    });
  }

  editEventModal(templateRef) {
    // this.eventForm.reset();
    this.editView = true;
    console.log("hekllo", this.calendarPreviewData);

    let dialogRef = this.dialog.open(templateRef, {
      width: "550px",
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  ////////////////////// Calendars ////////////////////

  //to get calendars list and set the local variable with response
  getCalendarList() {
    this.endPointService.getCalendars().subscribe(
      (res: any) => {
        this.spinner = false;
        this.calendarList = res;
        this.cd.detectChanges();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        this.cd.detectChanges();
      }
    );
  }

  //to create a calendar, it accepts calendar object (name:string, description:string, color:string,isChecked:boolean) as `data` parameter
  //and update the local list on success response
  createCalendar(data) {
    this.endPointService.createCalendars(data).subscribe(
      (res: any) => {
        // this.spinner = false;
        this.cd.detectChanges();
        this.getCalendarList();
      },
      (error) => {
        this.spinner = false;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        this.cd.detectChanges();
      }
    );
  }

  //to update calendar, it accepts reason object (name:string, description:string, color:string,isChecked:boolean) as `data` parameter
  //and update the local list on success response
  updateCalendar(data) {
    this.endPointService.updateCalendar(data).subscribe(
      (res: any) => {
        // this.spinner = false;
        this.editCalendarData = undefined;
        this.cd.detectChanges();
        this.getCalendarList();
      },
      (error) => {
        this.spinner = false;
        this.editCalendarData = undefined;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        this.cd.detectChanges();
      }
    );
  }

  //to delete calendar, it accepts calendar object id as `id` parameter and updating the local list on success response
  deleteCalendar(id) {
    this.endPointService.deleteCalendar(id).subscribe(
      (res: any) => {
        this.calendarList = this.calendarList.filter((item) => item.id != id);
        this.snackbar.snackbarMessage(
          "success-snackbar",
          "Deleted Successfully",
          1
        );
        this.editCalendarData = undefined;
        this.spinner = false;
        this.cd.detectChanges();
      },
      (error) => {
        this.spinner = false;
        this.editCalendarData = undefined;
        console.error("Error fetching:", error);
        if (error && error.status == 0)
          this.snackbar.snackbarMessage("error-snackbar", error.statusText, 1);
        this.cd.detectChanges();
      }
    );
  }

  onCalendarSave() {
    this.spinner = true;
    this.calendarForm.controls["color"].setValue(this.selectedColor);
    let data = this.calendarForm.value;

    if (this.editCalendarData) {
      data.id = this.editCalendarData.id;
      data.isChecked = this.editCalendarData.isChecked;
      this.updateCalendar(data);
    } else {
      data.isChecked = false;
      this.createCalendar(data);
    }
    this.cd.detectChanges();
  }

  //callback event on calendar checkbox change event
  onCalendarCheck(d) {
    d.isChecked = !d.isChecked;
  }

  openCalendarModal(templateRef) {
    this.calendarForm.reset();
    this.formHeading = "Create New Calendar";
    this.saveBtnText = "Save";
    this.selectedColor = "#25abcf";
    let dialogRef = this.dialog.open(templateRef, {
      width: "500px",
      height: "350px",
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  setEditValue(val) {
    this.editCalendarData = val;
  }

  editCalendar(templateRef) {
    this.calendarForm.reset();
    this.formHeading = "Create New Calendar";
    this.saveBtnText = "Save";
    this.calendarForm.patchValue(this.editCalendarData);
    this.selectedColor = this.editCalendarData?.color;
    let dialogRef = this.dialog.open(templateRef, {
      width: "500px",
      height: "350px",
      panelClass: "add-attribute",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.editCalendarData = undefined;
      }
    });
  }

  setDeleteCalenderData() {
    this.deleteConfirm(this.editCalendarData);
  }

  //Confirmation dialog for delete, it accepts the reason object as `data` parameter
  deleteConfirm(data) {
    let id = data.id;
    let msg = "Are you sure you want to delete this calendar ?";
    return this.dialog
      .open(ConfirmDialogComponent, {
        panelClass: "confirm-dialog-container",
        disableClose: true,
        data: {
          heading: "Delete Calendar",
          message: msg,
          text: "confirm",
          data: data,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.spinner = true;
        if (res === "delete") {
          this.deleteCalendar(id);
        } else {
          this.spinner = false;
        }
        this.cd.detectChanges();
      });
  }

  ///////////

  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      let calendar = [];
      this.calendarEvents = [];

      this.recurringEvents.forEach((event) => {
        const rule: RRule = new RRule({
          ...event.rrule,
          dtstart: event?.start,
          until: event?.end,
          interval: 1
        });
        const { title, color, end, start } = event;

        rule.all().forEach((date, index) => {
          // console.log("index==>", index);
          calendar.push({
            title,
            color,
            start: start,
            end: end,
          });
        });
      });

      this.calendarEvents = [...this.events, ...calendar];
      // console.log("calendar==>", this.calendarEvents);
      this.cd.detectChanges();
    }
  }
}
