import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MrdComponent } from './mrd.component';

describe('MrdComponent', () => {
  let component: MrdComponent;
  let fixture: ComponentFixture<MrdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
