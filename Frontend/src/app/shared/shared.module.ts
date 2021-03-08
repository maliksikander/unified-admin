import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import {
    MatAutocompleteModule,
    MatBadgeModule, MatBottomSheet, MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule, MatChipsModule,
    MatDatepickerModule, MatDialogModule, MatDrawer,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatListModule, MatMenuModule,
    MatNativeDateModule, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule,
    MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
    MatStepperModule, MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule, MatTree, MatTreeModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectSearchComponent } from './mat-select-search/mat-select-search.component';

import { SearchFilterPipe } from './search-filter.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {HealthStatusFilterPipe} from './healthStatus.pipe'
@NgModule({
    declarations: [MatSelectSearchComponent, SearchFilterPipe, ConfirmDialogComponent,HealthStatusFilterPipe],
    imports: [
        MatIconModule, MatToolbarModule, MatSidenavModule, MatBadgeModule, MatDialogModule,
        BrowserAnimationsModule, MatCheckboxModule, MatButtonModule, MatMenuModule,
        MatRadioModule, ReactiveFormsModule, MatRippleModule,
        MatListModule, MatSnackBarModule, MatTableModule, MatProgressSpinnerModule,
        MatProgressBarModule, MatCardModule, MatChipsModule, MatFormFieldModule,
        MatTabsModule, MatSelectModule, MatInputModule, MatTooltipModule, MatNativeDateModule,
        FormsModule, MatAutocompleteModule, MatSliderModule, MatStepperModule,
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
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatBottomSheetModule,

    ],
    exports: [
        MatIconModule, MatToolbarModule, MatSidenavModule, MatBadgeModule, MatNativeDateModule,
        MatDrawer, BrowserAnimationsModule, MatCheckboxModule, MatDialogModule,
        MatButtonModule, MatRadioModule, MatMenuModule,
        ReactiveFormsModule, MatListModule, MatSnackBarModule, MatRippleModule,
        MatProgressSpinnerModule, MatTableModule, MatProgressBarModule,
        MatCardModule, MatChipsModule, MatFormFieldModule, MatInputModule,
        MatTabsModule, MatSelectModule, MatTooltipModule, FormsModule, MatButtonModule,
        MatButtonToggleModule, MatSliderModule, MatStepperModule,
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
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatBottomSheetModule,
        MatSelectSearchComponent,
        SearchFilterPipe,
        HealthStatusFilterPipe,
        NgxPaginationModule,

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [
        ConfirmDialogComponent
    ]
})

export class SharedModule { }
