import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelTypeFormComponent } from "./channel-type-form.component";

describe("ChannelTypeFormComponent", () => {
  let component: ChannelTypeFormComponent;
  let fixture: ComponentFixture<ChannelTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelTypeFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
