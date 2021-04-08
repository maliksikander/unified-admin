import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChannelConnectorComponent } from './channel-connector.component';

describe('ChannelConnectorComponent', () => {
  let component: ChannelConnectorComponent;
  let fixture: ComponentFixture<ChannelConnectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
