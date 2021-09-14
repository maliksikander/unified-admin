import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReasonCodesComponent } from "./reason-codes.component";

describe("ReasonCodesComponent", () => {
  let component: ReasonCodesComponent;
  let fixture: ComponentFixture<ReasonCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReasonCodesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
