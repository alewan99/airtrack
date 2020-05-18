import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackHistoriaPage } from './track-historia.page';

describe('TrackHistoriaPage', () => {
  let component: TrackHistoriaPage;
  let fixture: ComponentFixture<TrackHistoriaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackHistoriaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackHistoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
