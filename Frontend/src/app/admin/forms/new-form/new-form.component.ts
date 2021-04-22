import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss']
})
export class NewFormComponent implements OnInit {

  @Input() uiBool;
  @Input() formData;
  @Output() uiBoolChange = new EventEmitter<any>();
  @Output() formSaveData = new EventEmitter<any>();
  newForm: FormGroup;
  customCollapsedHeight: string = '40px';
  expanded: boolean = false;
  // customExpandedHeight: string = '200px';


  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,) { }

  ngOnInit(): void {


    this.newForm = this.formBuilder.group({
      formTitle: [''],
      formDescription: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) { }

  onClose() {
    this.uiBoolChange.emit(!this.uiBool);
    // this.botSettingForm.reset();
  }

  onRequiredToggleChange(e) { }

  panelExpanded() {

    this.expanded = !this.expanded;
    // console.log("yo-->")
  }

  onSave() { }

}


