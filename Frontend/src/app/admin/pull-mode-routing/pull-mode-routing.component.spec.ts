import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullModeRoutingComponent } from './pull-mode-routing.component';

describe('PullModeRoutingComponent', () => {
  let component: PullModeRoutingComponent;
  let fixture: ComponentFixture<PullModeRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullModeRoutingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullModeRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
