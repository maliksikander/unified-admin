import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmqComponent } from './amq.component';

describe('AmqComponent', () => {
  let component: AmqComponent;
  let fixture: ComponentFixture<AmqComponent>;

  beforeEach(async(() => {
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
