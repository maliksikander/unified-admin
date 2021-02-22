import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common'
import { AmqComponent } from './amq.component';
import { AppModule } from '../../../app.module';
import { EndpointService } from '../../services/endpoint.service';
import { ConfigService } from '../../services/config.service';



fdescribe('AmqComponent', () => {
  let component: AmqComponent;
  let fixture: ComponentFixture<AmqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [AppModule],
      providers: [
        EndpointService,
        ConfigService
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeFalsy();
  });
});
