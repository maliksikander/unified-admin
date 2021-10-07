import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebWidgetListComponent } from './web-widget-list.component';

describe('WebWidgetListComponent', () => {
  let component: WebWidgetListComponent;
  let fixture: ComponentFixture<WebWidgetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebWidgetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebWidgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
