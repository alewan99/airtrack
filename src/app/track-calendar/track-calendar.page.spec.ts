import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackCalendarPage } from './track-calendar.page';

describe('TrackCalendarPage', () => {
  let component: TrackCalendarPage;
  let fixture: ComponentFixture<TrackCalendarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackCalendarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
