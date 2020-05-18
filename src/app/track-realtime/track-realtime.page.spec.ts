import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackRealtimePage } from './track-realtime.page';

describe('TrackRealtimePage', () => {
  let component: TrackRealtimePage;
  let fixture: ComponentFixture<TrackRealtimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackRealtimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackRealtimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
