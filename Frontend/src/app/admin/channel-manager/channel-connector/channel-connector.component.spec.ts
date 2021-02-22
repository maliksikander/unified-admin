import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelConnectorComponent } from './channel-connector.component';

describe('ChannelConnectorComponent', () => {
  let component: ChannelConnectorComponent;
  let fixture: ComponentFixture<ChannelConnectorComponent>;

  beforeEach(async(() => {
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
