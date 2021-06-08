import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTypeComponent } from './channel-type.component';

describe('ChannelTypeComponent', () => {
  let component: ChannelTypeComponent;
  let fixture: ComponentFixture<ChannelTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
