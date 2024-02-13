import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignatureComponent } from './email-signature.component';

describe('EmailSignatureComponent', () => {
  let component: EmailSignatureComponent;
  let fixture: ComponentFixture<EmailSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
