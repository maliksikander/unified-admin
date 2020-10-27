import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecisionQueueComponent } from './precision-queue.component';

describe('PrecisionQueueComponent', () => {
  let component: PrecisionQueueComponent;
  let fixture: ComponentFixture<PrecisionQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrecisionQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecisionQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
