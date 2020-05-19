import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackPointComponent } from './track-point.component';

describe('TrackPointComponent', () => {
  let component: TrackPointComponent;
  let fixture: ComponentFixture<TrackPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackPointComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
