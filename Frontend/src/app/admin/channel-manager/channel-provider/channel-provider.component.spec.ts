import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelProviderComponent } from './channel-provider.component';

describe('ChannelProviderComponent', () => {
  let component: ChannelProviderComponent;
  let fixture: ComponentFixture<ChannelProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
