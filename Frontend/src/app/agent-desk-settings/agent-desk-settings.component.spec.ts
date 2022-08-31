import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDeskSettingsComponent } from './agent-desk-settings.component';

describe('AgentDeskSettingsComponent', () => {
  let component: AgentDeskSettingsComponent;
  let fixture: ComponentFixture<AgentDeskSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDeskSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDeskSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
