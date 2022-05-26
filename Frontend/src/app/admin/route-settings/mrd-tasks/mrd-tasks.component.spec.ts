import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrdTasksComponent } from './mrd-tasks.component';

describe('MrdTasksComponent', () => {
  let component: MrdTasksComponent;
  let fixture: ComponentFixture<MrdTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrdTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrdTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
