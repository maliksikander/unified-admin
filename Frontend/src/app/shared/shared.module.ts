import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTree, MatTreeModule } from "@angular/material/tree";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchFilterPipe } from "./search-filter.pipe";
import { RemoveCharacterFilterPipe } from "./remove-character.pipe";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import {AngularMultiSelectModule} from "angular2-multiselect-dropdown";
import {QuillModule} from 'ngx-quill';

@NgModule({
  declarations: [
    SearchFilterPipe,
    RemoveCharacterFilterPipe,
    // Ng2SearchPipeModule,
    ConfirmDialogComponent,
  ],
  imports: [
    Ng2SearchPipeModule,
    DragDropModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatBadgeModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatListModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatNativeDateModule,
    FormsModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatStepperModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatBottomSheetModule,
    AngularMultiSelectModule,
    QuillModule.forRoot()
  ],
  exports: [
    DragDropModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatDrawer,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatListModule,
    MatSnackBarModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatStepperModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatBottomSheetModule,
    SearchFilterPipe,
    RemoveCharacterFilterPipe,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    QuillModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmDialogComponent],
})
export class SharedModule {}
