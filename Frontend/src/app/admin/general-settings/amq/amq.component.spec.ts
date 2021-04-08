import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmqComponent } from './amq.component';

describe('AmqComponent', () => {
  let component: AmqComponent;
  let fixture: ComponentFixture<AmqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
