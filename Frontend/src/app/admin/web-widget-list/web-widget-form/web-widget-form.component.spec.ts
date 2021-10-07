import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebWidgetFormComponent } from './web-widget-form.component';

describe('WebWidgetFormComponent', () => {
  let component: WebWidgetFormComponent;
  let fixture: ComponentFixture<WebWidgetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebWidgetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebWidgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
