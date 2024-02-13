import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAutoResponseComponent } from './email-auto-response.component';

describe('EmailAutoResponseComponent', () => {
  let component: EmailAutoResponseComponent;
  let fixture: ComponentFixture<EmailAutoResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailAutoResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAutoResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
